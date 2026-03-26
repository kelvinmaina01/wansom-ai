import { modelDispatcher } from '../services/modelDispatcher.js';
import logger from '../utils/logger.js';

export class UXGeneratorAgent {
  constructor() {
    this.role = 'UX Generator Agent';
    this.systemInstruction = `
      You are an expert UX Generator Agent for "Lawlify AI", a legal tech platform for East African lawyers.
      Your task is to generate configuration for a Custom AI Legal Specialist based on the user's prompt.
      
      Focus on East African jurisdictions (Kenya, Uganda, Tanzania, Rwanda, Ethiopia, etc.).
      
      Respond ONLY with a valid JSON object matching this schema:
      {
        "name": string (A professional title for the agent, e.g., "Senior Maritime Counsel"),
        "description": string (A concise 1-2 sentence description of what the agent does),
        "icon": string (One of: "Briefcase", "Newspaper", "FileText", "ShieldCheck", "Gavel", "Lightbulb", "Users", "Home", "Calculator"),
        "practiceAreas": string[] (Array of relevant practice areas),
        "jurisdictions": string[] (Array of relevant East African countries),
        "instructions": string (A detailed system prompt),
        "color": string (One of: "blue", "emerald", "indigo", "rose", "amber", "violet", "cyan", "orange", "red")
      }
    `;
  }

  async generatePersona(prompt) {
    logger.info(`UXGeneratorAgent generating persona for: ${prompt}`);

    try {
      const result = await modelDispatcher.dispatch(`${this.systemInstruction}\n\nClient Request: ${prompt}`, {
        context: { taskType: 'reasoning', specialistId: 'ux-generator' },
        history: []
      });
      
      const jsonStr = result.answer.match(/\{[\s\S]*\}/) ? result.answer.match(/\{[\s\S]*\}/)[0] : result.answer;
      return JSON.parse(jsonStr);
    } catch (error) {
      logger.error("UXGeneratorAgent Error:", error.message);
      throw error;
    }
  }
}
