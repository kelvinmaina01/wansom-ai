import { createClient } from '@supabase/supabase-js';
import { modelDispatcher } from './modelDispatcher.js';
import logger from '../utils/logger.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Report Service
 * Synthesizes months of judicial data into a high-level strategic playbook.
 */
export class ReportService {
    
    /**
     * Generates a "Beautiful" Intelligence Report for a specific judge.
     * @param {string} judgeId 
     */
    async generateIntelligenceReport(judgeId) {
        try {
            logger.info(`Generating deep intelligence report for judge: ${judgeId}`);

            // 1. Fetch comprehensive judge data
            const { data: judge } = await supabase.from('judges').select('*').eq('id', judgeId).single();
            const { data: rulings } = await supabase.from('rulings').select('*').eq('judge_id', judgeId).order('created_at', { ascending: false }).limit(20);
            const { data: insights } = await supabase.from('judge_insights').select('*').eq('judge_id', judgeId);
            const { data: citations } = await supabase.from('citations').select('*').eq('judge_id', judgeId).order('times_cited', { ascending: false }).limit(10);

            if (!judge) throw new Error("Judge not found");

            // 2. Synthesis Prompt
            const dataContext = {
                judge: { name: judge.name, title: judge.title, court: judge.court },
                rulings: rulings.map(r => ({ outcome: r.outcome, for: r.outcome_for, type: r.case_type })),
                insights: insights.map(i => i.insight_text),
                citations: citations.map(c => c.cited_case)
            };

            const prompt = `
            You are the Lead Judicial Strategist for Lawlify AI.
            Synthesize the following judicial data into a "Strategic Intelligence Playbook".
            
            [DATA CONTEXT]
            ${JSON.stringify(dataContext)}
            
            [STRUCTURE REQUIRED]
            Return a JSON object with these EXACT sections:
            1. executive_summary: A high-level 2-sentence summary of the judge's philosophy.
            2. litigation_tactics: 3 bullet points on how to win before this judge.
            3. hostile_territory: Which case types are most often dismissed by this judge.
            4. citation_strategy: How to use their favorite precedents.
            5. risk_level: "low" | "medium" | "high" | "extreme".
            
            Ensure the tone is tactical, strategic, and professional.
            `;

            const response = await modelDispatcher.dispatch(prompt, { 
                context: { 
                    taskType: "analytical", 
                    specialistId: "legal-researcher",
                    extraSkillIds: ['intelligence-judicial']
                } 
            });

            // Extract JSON
            const reportData = this._extractJSON(response.answer);
            
            return {
                id: `REP-${Date.now()}`,
                judge_name: judge.name,
                generated_at: new Date().toISOString(),
                sections: reportData
            };

        } catch (error) {
            logger.error("Report Generation Error:", error);
            throw error;
        }
    }

    /**
     * Handles follow-up questions about a specific judge report.
     */
    async handleChatFollowup(judgeId, question) {
        try {
            const { data: judge } = await supabase.from('judges').select('name, court').eq('id', judgeId).single();
            const { data: insights } = await supabase.from('judge_insights').select('insight_text').eq('judge_id', judgeId);

            const prompt = `
            Question: ${question}
            Context: You are discussing Judge ${judge.name} of the ${judge.court}. 
            Known Insights: ${insights.map(i => i.insight_text).join('; ')}
            
            Answer the user's question with tactical legal advice based on these judicial patterns.
            `;

            const response = await modelDispatcher.dispatch(prompt, { 
                context: { 
                    taskType: "reasoning",
                    extraSkillIds: ['intelligence-judicial']
                } 
            });
            return response.answer;
        } catch (error) {
            logger.error("Chat Follow-up Error:", error);
            return "I'm sorry, I'm having trouble analyzing that specific pattern right now.";
        }
    }

    _extractJSON(text) {
        const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        return match ? JSON.parse(match[0]) : {};
    }
}

export const reportService = new ReportService();
