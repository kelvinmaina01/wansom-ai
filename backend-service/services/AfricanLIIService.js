import axios from 'axios';
import logger from '../utils/logger.js';

/**
 * AfricanLII Service
 * Fetches real judgment data from AfricanLII / Laws.Africa endpoints.
 */
export class AfricanLIIService {
    constructor() {
        this.token = process.env.LAWS_AFRICA_API_KEY;
        this.baseUrl = 'https://api.laws.africa/v3';
    }

    /**
     * Fetches recent judgments for a specific judge or general query.
     * @param {string} query - The search term (e.g., judge name).
     * @param {string} dateAfter - ISO date string (YYYY-MM-DD).
     */
    async fetchRecentJudgments(query = '', dateAfter = '') {
        try {
            if (!this.token) {
                logger.warn("LAWS_AFRICA_API_KEY missing. AfricanLII fetch will fail.");
                return [];
            }

            // Fallback to last Monday if no date provided
            if (!dateAfter) {
                const now = new Date();
                const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday
                const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                const lastMonday = new Date(now.setDate(diff));
                dateAfter = lastMonday.toISOString().split('T')[0];
            }

            logger.info(`Fetching judgments for "${query}" after ${dateAfter}`);

            const response = await axios.get(`${this.baseUrl}/search`, {
                params: {
                    q: query,
                    date_after: dateAfter,
                    page_size: 20
                },
                headers: {
                    'Authorization': `Token ${this.token}`
                }
            });

            // AfricanLII/Laws.Africa usually returns results in a 'results' or 'data' array
            const results = response.data.results || response.data || [];
            
            return results.map(item => ({
                id: item.id || item.url,
                title: item.title || item.name,
                full_text: item.body || item.content_html || item.text || "",
                date: item.date || item.publication_date,
                court: item.court || item.jurisdiction,
                url: item.url || `https://africanlii.org/view/${item.id}`
            }));

        } catch (error) {
            logger.error("AfricanLII Fetch Error:", error.response?.data || error.message);
            // Return empty array instead of throwing to allow other judges to be processed
            return [];
        }
    }

    /**
     * Fetches a specific judgment's full text if not present in search results.
     */
    async getJudgmentText(id) {
        try {
            const response = await axios.get(`${this.baseUrl}/judgments/${id}`, {
                headers: { 'Authorization': `Token ${this.token}` }
            });
            return response.data.body || response.data.text || "";
        } catch (error) {
            logger.error(`Error fetching judgment ${id}:`, error.message);
            return "";
        }
    }
}

export const africanLIIService = new AfricanLIIService();
