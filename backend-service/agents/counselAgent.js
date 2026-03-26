import { modelDispatcher } from '../services/modelDispatcher.js';
import logger from '../utils/logger.js';

/**
 * Counsel Agent Model
 * Primary purpose: Interpret complex legal queries using Hybrid Orchestration.
 */
export class CounselAgent {
    constructor() {
        this.role = 'Senior Legal Counsel';
    }

    /**
     * Process a natural language query using the Hybrid Engine.
     */
    async processQuery(userQuery, options = {}) {
        logger.info(`CounselAgent processing: ${userQuery}`);
        
        try {
            // Determine task type based on intent or options
            const result = await modelDispatcher.dispatch(userQuery, {
                context: { taskType, specialistId: 'counsel' },
                history: options.history || [],
                documentId: options.documentId || null
            });

            return {
                text: result.answer,
                thinking: result.thinking,
                model: result.model,
                citations: result.citations || []
            };
        } catch (error) {
            logger.error('CounselAgent Error:', error.message);
            throw error;
        }
    }
}
