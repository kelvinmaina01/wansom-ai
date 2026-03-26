import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { modelDispatcher } from './modelDispatcher.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Robustly extract JSON from a string that might contain markdown or conversation.
 */
function extractJSON(text) {
    try {
        // Try direct parse first
        return JSON.parse(text);
    } catch (e) {
        // Try to find anything between { } or [ ]
        const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (match) {
            try {
                return JSON.parse(match[0]);
            } catch (e2) {
                // If nested parsing fails, try cleaning triple backticks
                const cleaned = match[0].replace(/```json|```/g, '').trim();
                return JSON.parse(cleaned);
            }
        }
        throw new Error("No valid JSON found in response: " + text.substring(0, 100));
    }
}

/**
 * Judicial Intelligence Service
 * Handles data ingestion, AI-powered parsing, and strategic analytics for judges.
 */
export class JudicialIntelligence {
    
    /**
     * Seeds the initial list of prominent East African judges.
     */
    async seedJudges() {
        const primaryJudges = [
            {
                full_name: 'Justice Alfred Mabeya',
                title: 'Presiding Judge',
                court: 'High Court of Kenya',
                division: 'Commercial',
                jurisdiction: 'kenya',
                image: 'https://api.dicebear.com/7.x/initials/svg?seed=AM',
                known_for: 'Strict adherence to procedural timelines in commercial matters.'
            },
            {
                full_name: 'Justice Mumbi Ngugi',
                title: 'Judge of Appeal',
                court: 'Court of Appeal of Kenya',
                division: 'Civil',
                jurisdiction: 'kenya',
                image: 'https://api.dicebear.com/7.x/initials/svg?seed=MN',
                known_for: 'Progressive rulings on socio-economic rights and human rights.'
            },
            {
                full_name: 'Justice George Odunga',
                title: 'Judge of Appeal',
                court: 'Court of Appeal of Kenya',
                division: 'Civil',
                jurisdiction: 'kenya',
                image: 'https://api.dicebear.com/7.x/initials/svg?seed=GO',
                known_for: 'Exemplary efficiency and thoroughness on administrative justice.'
            }
        ];

        for (const judge of primaryJudges) {
            const { error } = await supabase
                .from('judges')
                .upsert([judge], { onConflict: 'full_name' });
            
            if (error) logger.error(`Error seeding judge ${judge.full_name}:`, error);
        }
        
        return { success: true, message: "Base judges seeded." };
    }

    /**
     * AI Parsing Pipeline: Extracts structured info from raw judgment text.
     */
    async parseJudgment(judgmentId, rawText) {
        try {
            const prompt = `
            You are a legal data extraction engine for Lawlify AI.
            Extract structured outcomes and strategic signals from the following court judgment.
            
            [JUDGMENT TEXT START]
            ${rawText.substring(0, 10000)}
            [JUDGMENT TEXT END]
            
            Return ONLY a JSON object with these fields:
            {
                "outcome": "allowed" | "dismissed" | "partially_allowed",
                "outcome_for": "plaintiff" | "defendant" | "petitioner" | "respondent",
                "case_type": "commercial" | "civil" | "land" | "constitutional" | "employment",
                "matter_summary": "1 sentence summary",
                "reasoning_keywords": ["keyword1", "keyword2"],
                "key_statutes": ["Statute 1", "Statute 2"],
                "cited_cases": ["Case Name [Year] Citation"]
            }
            `;

            const response = await modelDispatcher.dispatch(prompt, { 
                context: { taskType: "analytical", specialistId: "legal-researcher" } 
            });

            const parsed = extractJSON(response.answer);

            // 1. Insert into rulings
            await supabase.from('rulings').insert([{
                judgment_id: judgmentId,
                judge_id: await this._getJudgeIdForJudgment(judgmentId),
                outcome: parsed.outcome,
                outcome_for: parsed.outcome_for,
                case_type: parsed.case_type,
                matter_summary: parsed.matter_summary,
                reasoning_keywords: parsed.reasoning_keywords,
                key_statutes: parsed.key_statutes
            }]);

            // 2. Upsert citations
            if (parsed.cited_cases && parsed.cited_cases.length > 0) {
                for (const citedCase of parsed.cited_cases) {
                    // Logic to increment times_cited
                    const judgeId = await this._getJudgeIdForJudgment(judgmentId);
                    await supabase.rpc('increment_citation', { 
                        p_judge_id: judgeId, 
                        p_case: citedCase,
                        p_case_type: parsed.case_type
                    });
                }
            }

            return { success: true, data: parsed };
        } catch (error) {
            logger.error("AI Parsing Error:", error);
            throw error;
        }
    }

    /**
     * Generates strategic insights for a judge based on accumulated rulings.
     */
    async refreshInsights(judgeId) {
        // 1. Fetch aggregated stats
        const { data: stats } = await supabase
            .from('judge_ruling_rates')
            .select('*')
            .eq('judge_id', judgeId);
        
        const { data: citations } = await supabase
            .from('citations')
            .select('*')
            .eq('judge_id', judgeId)
            .order('times_cited', { ascending: false })
            .limit(10);

        if (!stats || stats.length === 0) return { success: false, message: "No data to analyze." };

        const summary = `
        Judge Stats: ${JSON.stringify(stats)}
        Common Citations: ${JSON.stringify(citations)}
        `;

        const prompt = `
        Based on the historical data below, generate 4 practical strategic tips for a lawyer appearing before this judge.
        Format as JSON array: [{"type": "tip"|"caution"|"style", "text": "...", "confidence": "high"|"medium"}]
        
        ${summary}
        `;

        const response = await modelDispatcher.dispatch(prompt, { context: { taskType: "reasoning" } });
        const insights = extractJSON(response.answer);

        // Store insights
        for (const ins of insights) {
            await supabase.from('judge_insights').insert([{
                judge_id: judgeId,
                insight_type: ins.type,
                insight_text: ins.text,
                confidence: ins.confidence,
                based_on_n: stats.reduce((acc, s) => acc + s.total_cases, 0)
            }]);
        }

        return { success: true, insights };
    }

    async _getJudgeIdForJudgment(judgmentId) {
        const { data } = await supabase.from('judgments').select('judge_id').eq('id', judgmentId).single();
        return data?.judge_id;
    }
}

export const judicialIntelligence = new JudicialIntelligence();
