import axios from 'axios';
import logger from '../utils/logger.js';

/**
 * PageIndexService
 * Handles communication with the PageIndex Python microservice.
 */
export class PageIndexService {
    constructor() {
        // Points to the local forked repo server or production microservice
        this.baseUrl = process.env.PAGEINDEX_URL || 'http://localhost:8000';
    }

    /**
     * Trigger the "Cook" process for a document.
     * @param {string} fileUrl - The public or signed URL of the raw PDF
     * @param {string} documentId - The UUID from our knowledge_base table
     */
    async cookDocument(fileUrl, documentId) {
        logger.info(`Triggering PageIndex Cook for ${documentId}`);
        try {
            const response = await axios.post(`${this.baseUrl}/index`, {
                file_url: fileUrl,
                document_id: documentId
            });
            return response.data;
        } catch (error) {
            logger.error(`PageIndex Cook Error for ${documentId}:`, error.message);
            throw new Error(`Failed to trigger PageIndex: ${error.message}`);
        }
    }

    /**
     * Query a specific indexed document.
     * @param {string} documentId - The UUID
     * @param {string} query - The legal question
     */
    async queryIndex(documentId, query) {
        logger.info(`Querying PageIndex for document ${documentId}`);
        try {
            const response = await axios.post(`${this.baseUrl}/query`, {
                document_id: documentId,
                query: query
            });
            return response.data; // Expected: { answer: '...', citations: [...] }
        } catch (error) {
            logger.error(`PageIndex Query Error for ${documentId}:`, error.message);
            throw new Error(`Failed to query PageIndex: ${error.message}`);
        }
    }

    /**
     * Get indexing status of a document.
     */
    async getStatus(documentId) {
        try {
            const response = await axios.get(`${this.baseUrl}/status/${documentId}`);
            return response.data;
        } catch (error) {
            logger.error(`PageIndex Status Error for ${documentId}:`, error.message);
            return { status: 'unknown' };
        }
    }
}

export const pageIndexService = new PageIndexService();
