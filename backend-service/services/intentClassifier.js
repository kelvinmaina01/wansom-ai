import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from "../utils/logger.js";

/**
 * IntentClassifier
 * Uses a reasoning-first approach (Gemini Flash) to classify user intent.
 * NO HARDCODED KEYWORD BRIDGES.
 */
export class IntentClassifier {
    constructor() {
        const key = process.env.GEMINI_API_KEY;
        this.genAI = key ? new GoogleGenerativeAI(key) : null;
    }

    async classify(query) {
        if (!this.genAI) {
            logger.warn("Gemini API key missing. Defaulting to legal_advice intent.");
            return 'legal_advice';
        }

        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
            // RESEARCH-ALIGNED PROMPT: Focus on structural legal workflows
            const prompt = `
                Analyze the user's legal request and classify it into EXACTLY ONE of these categories:
                
                1. draft_contract: The user wants to write, create, or prepare a formal legal document (agreement, NDA, letter, etc.).
                2. legal_advice: The user is asking for their rights, interpretation of a law, or advice on a specific situation.
                3. case_analysis: The user is asking about specific court rulings, precedents, or litigation strategy.
                4. document_review: The user wants to analyze or check an existing document/clause.
                5. general_query: Simple greetings, non-legal questions, or ambiguous statements.

                User Message: "${query}"

                Respond with ONLY the category name. No explanations.
                Label:
            `;

            const result = await model.generateContent(prompt);
            const text = result.response.text().trim().toLowerCase();
            
            const validIntents = ['draft_contract', 'legal_advice', 'case_analysis', 'document_review', 'general_query'];
            for (const intent of validIntents) {
                if (text.includes(intent)) {
                    logger.info(`Dynamic Intent Detected: ${intent}`);
                    return intent;
                }
            }
            
            return 'legal_advice';
        } catch (error) {
            logger.error("Dynamic Intent classification failed:", error.message);
            return 'legal_advice';
        }
    }
}

export const intentClassifier = new IntentClassifier();
