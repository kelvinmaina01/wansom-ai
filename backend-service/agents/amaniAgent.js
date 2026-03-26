import { modelDispatcher } from '../services/modelDispatcher.js';
import logger from '../utils/logger.js';

export class AmaniAgent {
    constructor() {
        this.role = 'Amani (Legal Mentor)';
    }

    getSystemInstruction(mode) {
        const baseInstruction = `You are Amani, an AI Mentor for East African lawyers. You are conducting a voice-based/chat-based session. Your responses should be concise, professional, and tailored to the spoken format. Keep responses under 3 paragraphs. Focus on Kenyan and East African legal contexts.`;

        switch (mode) {
            case 'senior-partner':
                return `${baseInstruction}\n\nYou are acting as a Senior Partner at a top-tier law firm. Provide career advice, ethical guidance, and practical practice management tips. Be authoritative but supportive, drawing from "years of experience".`;
            case 'socratic-tutor':
                return `${baseInstruction}\n\nYou are a Socratic Tutor. DO NOT give direct answers immediately. Instead, challenge the user with probing questions to guide them to discover the answer themselves. Focus on statutory interpretation, case law principles, and legal reasoning. Challenge their assumptions.`;
            case 'mock-judge':
                return `${baseInstruction}\n\nYou are a Mock Judge in an East African superior court. You are evaluating oral submissions or cross-examination. Challenge the counsel's arguments, demand binding precedents, point out logical fallacies, and maintain a strict, formal judicial temperament.`;
            default:
                return baseInstruction;
        }
    }

    async processMessage(mode, chatHistory, newMsg) {
        logger.info(`AmaniAgent (${mode}) processing: ${newMsg}`);

        try {
            const systemPrompt = this.getSystemInstruction(mode);
            const history = chatHistory.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            }));

            // Use reasoning mode for mentorship sessions
            const result = await modelDispatcher.dispatch(`${systemPrompt}\n\nUser: ${newMsg}`, {
                context: { taskType: 'reasoning', specialistId: 'amani' },
                history: history
            });

            return { text: result.answer };

        } catch (error) {
            logger.error(`AmaniAgent Error (${mode}):`, error.message);
            throw error;
        }
    }

    async evaluateTranscript(chatHistory) {
        logger.info("AmaniAgent performing evaluation...");

        try {
            const evaluationInstruction = `
            You are a master legal evaluator analyzing a transcript between a user (lawyer/law student) and an AI Mentor (Amani).
            Evaluate the user's performance based on:
            1. Statutory Accuracy (Did they cite laws correctly?)
            2. Logical Reasoning
            3. Persuasiveness/Professionalism
            
            Return JSON:
            {
              "score": number (0-100),
              "strengths": string[],
              "areasForImprovement": string[],
              "overallFeedback": string
            }
          `;

            const transcriptText = chatHistory.map(msg =>
                `[${msg.sender.toUpperCase()}]: ${msg.text}`
            ).join('\n\n');

            const result = await modelDispatcher.dispatch(`${evaluationInstruction}\n\nEvaluate this transcript:\n\n${transcriptText}`, {
                context: { taskType: 'reasoning', specialistId: 'amani-eval' },
                history: [] // Keeping history as an empty array as it's a new evaluation prompt
            });
      
            const jsonStr = result.answer.match(/\{[\s\S]*\}/) ? result.answer.match(/\{[\s\S]*\}/)[0] : result.answer;
            return JSON.parse(jsonStr);

        } catch (error) {
            logger.error("AmaniAgent Evaluation Error:", error.message);
            throw error;
        }
    }
}
