import axios from 'axios';
import logger from '../utils/logger.js';

export class SearchService {
  constructor() {
    this.apiKey = process.env.TAVILY_API_KEY;
  }

  async search(query) {
    if (!this.apiKey) {
      logger.warn("TAVILY_API_KEY not set. Using mock search results.");
      return [
        { title: "Mock Kenyan Law Search Result", url: "https://kenyalaw.org", content: "This is a placeholder for search results related to Kenyan Law." }
      ];
    }

    try {
      const response = await axios.post('https://api.tavily.com/search', {
        api_key: this.apiKey,
        query: query,
        search_depth: "balanced",
        include_answer: true,
        max_results: 5
      });

      return response.data.results.map(r => ({
        title: r.title,
        url: r.url,
        content: r.content
      }));
    } catch (error) {
      logger.error("Tavily Search Error:", error.message);
      return [];
    }
  }
}

export const searchService = new SearchService();
