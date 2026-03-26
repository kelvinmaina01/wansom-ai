import { modelDispatcher } from '../services/modelDispatcher.js';
import logger from '../utils/logger.js';

/**
 * Drafter Agent Model
 * Primary purpose: Automate the creation of complex legal templates.
 */
export class DrafterAgent {
    constructor() {
        this.role = 'Senior Legal Drafter';
    }

    /**
     * Draft a legal document.
     * @param {string} userInstructions The specific facts and requirements for the draft.
     */
    async draftDocument(userInstructions, options = {}) {
        logger.info(`DrafterAgent initiating draft for: ${userInstructions}`);
        
        try {
            const systemInstruction = `You are a Senior Legal Drafter specializing in East African Law.
Generate precise, formatted legal documents. Adhere strictly to civil procedure formatting.`;

            const result = await modelDispatcher.dispatch(`${systemInstruction}\n\nInstructions: ${userInstructions}`, {
                context: { taskType: 'reasoning', specialistId: 'drafter' },
                history: options.history || []
            });

            return {
                text: result.answer,
                thinking: result.thinking,
                model: result.model
            };
            
        } catch (error) {
            logger.error('DrafterAgent Error:', error.message);
            throw error;
        }
    }
}
