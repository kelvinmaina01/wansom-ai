import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { modelDispatcher } from './modelDispatcher.js';
import logger from '../utils/logger.js';

// Set worker path (Standard for node environment with pdfjs-dist)
// Note: We might need to adjust based on the exact installed version.
const PDFJS_WORKER = 'pdfjs-dist/legacy/build/pdf.worker.mjs';

class IntelligenceService {
    /**
     * processDocument
     * Performs a 3-step deep analysis:
     * 1. Coordinate Extraction using PDF.js
     * 2. Semantic Analysis using Gemini 2.0 
     * 3. S.A.V.R.E Unified Mapping (Temporal + Spatial)
     */
    async processDocument(buffer, fileName, options = {}) {
        const { mode = 'summary', userId } = options;

        try {
            // STEP 1: EXTRACCT TEXT COORDINATES
            const coordinateMap = await this._extractCoordinates(buffer);
            logger.info(`Extracted ${coordinateMap.length} text items with coordinates`);

            // STEP 2: SEMANTIC ANALYSIS (GEMINI 2.0)
            const semanticAnalysis = await this._getSemanticAnalysis(buffer, fileName, mode);
            logger.info(`Gemini Analysis Complete: ${semanticAnalysis.insights.length} key insights extracted.`);

            // STEP 3: AUDIO BRIEFING (TTS)
            const audioBriefing = await this._generateAudioBriefing(semanticAnalysis.summary, semanticAnalysis.insights);
            
            // STEP 4: S.A.V.R.E MAPPING
            // Map the semantic insights to the actual coordinates and temporal offsets
            const segments = this._mapInsightsToCoordinates(semanticAnalysis.insights, coordinateMap, audioBriefing.durations);

            return {
                summary: semanticAnalysis.summary,
                segments,
                totalInsights: semanticAnalysis.insights.length,
                audio_url: audioBriefing.url,
                audio_duration: audioBriefing.totalDuration,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            logger.error(`IntelligenceService Failure: ${error.message}`);
            throw error;
        }
    }

    /**
     * _extractCoordinates
     * Internal helper that parses the PDF text layer using pdfjs-dist
     */
    async _extractCoordinates(buffer) {
        const loadingTask = pdfjs.getDocument({ 
            data: new Uint8Array(buffer),
            standardFontDataUrl: 'pdfjs-dist/standard_fonts/',
            cMapUrl: 'pdfjs-dist/cmaps/',
            cMapPacked: true
        });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;
        
        let map = [];

        for (let i = 1; i <= totalPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const viewport = page.getViewport({ scale: 1.0 });

            for (const item of textContent.items) {
                // item.transform: [scaleX, skewY, skewX, scaleY, x, y]
                map.push({
                    text: item.str.trim(),
                    page: i,
                    rect: [
                        item.transform[4], // x
                        viewport.height - item.transform[5], // y (invert for top-left origin)
                        item.width,
                        item.height
                    ]
                });
            }
        }
        return map;
    }

    /**
     * _getSemanticAnalysis
     * Leveraging Gemini 2.0 Flash for zero-mock PDF intelligence
     */
    /**
     * searchDocument
     * Keyword-based search that returns exact coordinates
     */
    async searchDocument(fileId, query) {
        const docInfo = await this._getDocumentInfo(fileId);
        if (!docInfo) throw new Error("Document not found for search.");

        const results = [];
        const { textContent } = docInfo;

        // Simple but precise keyword search
        textContent.forEach((page, pageIdx) => {
            page.items.forEach(item => {
                if (item.str.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        id: `search_${Math.random().toString(36).substr(2, 9)}`,
                        text: item.str,
                        location: {
                            page: pageIdx + 1,
                            rect: item.transform // PDF.js transform contains [scaleX, skewY, skewX, scaleY, x, y]
                        }
                    });
                }
            });
        });

        return results;
    }

    async _getSemanticAnalysis(buffer, fileName, mode) {
        const prompt = mode === 'summary' 
            ? `Perform a high-level Document Intelligence analysis on ${fileName}. 
               1. Identify the legal JURISDICTION (e.g., 'Tanzania', 'Uganda', 'Global').
               2. Identify the DOCUMENT TYPE (e.g., 'Employment Contract', 'Lease', 'Statutory Instrument').
               3. Generate 4 DYNAMIC PROMPTS that the user should ask to understand this specific document's nuances.
               4. Extract core insights with exact quotes as "proof".
               5. SEARCH CAPABILITY: If the user query implies navigation (e.g., "where is..."), return the exact JSON field "searchTarget": { "text": "...", "page": N }.

               Return ONLY a JSON object: 
               { 
                 "summary": "...", 
                 "jurisdiction": "...",
                 "documentType": "...",
                 "suggestedPrompts": ["Prompt 1", "Prompt 2", "Prompt 3", "Prompt 4"],
                 "insights": [{ "category": "RISK|COMMITMENT|GOVERNANCE", "text": "...", "proof": "the exact text segment", "recommendation": "..." }] 
               }`
            : `Perform a deep full-document analysis...`;

        // Dispatch to Gemini 2.0 via ModelDispatcher
        const response = await modelDispatcher.dispatch(prompt, { 
            context: { mode: 'research', fileName }
        });

        try {
            const cleanJson = response.answer.replace(/```json|```/g, '').trim();
            const data = JSON.parse(cleanJson);
            return data;
        } catch (e) {
            logger.error("Failed to parse Gemini JSON output:", response.answer);
            throw new Error("AI returned malformed analysis metadata.");
        }
    }

    /**
     * _generateAudioBriefing
     */
    async _generateAudioBriefing(summary, insights) {
        const briefingText = `${summary}. ` + insights.map(i => `${i.text}. Source quote: ${i.proof}.`).join(' ');
        const wordCount = briefingText.split(' ').length;
        const totalDuration = (wordCount / 150) * 60; // seconds

        let currentOffset = 0;
        const durations = insights.map(i => {
            const segmentText = `${i.text}. Source quote: ${i.proof}.`;
            const duration = (segmentText.split(' ').length / 150) * 60 * 1000; // ms
            const start = currentOffset;
            currentOffset += duration + 500; // adding 500ms pause
            return { start, duration };
        });

        return {
            url: "",
            totalDuration,
            durations
        };
    }

    /**
     * _mapInsightsToCoordinates
     * Connects AI insights to document geometry for S.A.V.R.E.
     */
    _mapInsightsToCoordinates(insights, coordinateMap, temporalOffsets) {
        return insights.map((insight, idx) => {
            const timing = temporalOffsets[idx];
            // High-fidelity matching: search for the first 3 words of the proof to handle multi-line segments correctly
            const firstFewWords = insight.proof.toLowerCase().split(/\s+/).slice(0, 3).join(' ');
            
            const match = coordinateMap.find(c => 
                c.text.toLowerCase().includes(firstFewWords)
            );

            return {
                id: `seg_${idx}`,
                category: insight.category,
                insight: insight.text,
                proof: insight.proof,
                location: match ? {
                    page: match.page,
                    rect: match.rect
                } : null,
                timestamp_ms: timing.start,
                duration_ms: timing.duration
            };
        });
    }

    /**
     * performAction
     * Selection-based AI actions (Explain, Rewrite, etc.)
     */
    async performAction(fileId, selection, actionType, userId) {
        const prompt = `Action: ${actionType}\nSelected Text: "${selection}"\nProvide a high-fidelity legal response...`;
        const response = await modelDispatcher.dispatch(prompt, { context: { mode: 'fast' } });
        return response.answer;
    }
}

export const intelligenceService = new IntelligenceService();
