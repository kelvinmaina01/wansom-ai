import { Resend } from 'resend';
import { modelDispatcher } from './modelDispatcher.js';
import logger from '../utils/logger.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export class NewsletterService {
    
    /**
     * Composes the weekly "Tactical & Strategic" newsletter using AI.
     */
    async composeWeeklyReport(newRulings, updatedJudges) {
        try {
            const dataSummary = {
                period: "Last 7 Days",
                newRulingsCount: newRulings.length,
                impactedJudges: updatedJudges.map(j => j.name),
                highlights: newRulings.slice(0, 5).map(r => ({
                    title: r.title,
                    outcome: r.outcome,
                    judge: r.judge_name
                }))
            };

            const prompt = `
            You are the Chief Legal Analyst for Lawlify AI.
            Write a "Tactical & Strategic" weekly newsletter for legal practitioners in East Africa.
            Focus on how recent rulings change the litigation landscape.
            
            [DATA FOR THIS WEEK]
            ${JSON.stringify(dataSummary)}
            
            [STRUCTURE]
            1. Executive Summary (High impact)
            2. Judge Spotlight (Who is trending and why)
            3. Tactical Tip of the Week (Based on recent outcomes)
            4. Closing Note
            
            Return the content in clean, premium HTML format suitable for an email body. 
            Use inline styles. Use a dark, professional theme (bg: #0a0a0a, text: #ffffff, accent: #ef4444).
            `;

            const response = await modelDispatcher.dispatch(prompt, { 
                context: { taskType: "analytical", specialistId: "legal-researcher" } 
            });

            return response.answer;
        } catch (error) {
            logger.error("Newsletter Composition Error:", error);
            throw error;
        }
    }

    /**
     * Fetches subscribers and sends the email batches.
     * Scale: 10,000 users distribution.
     */
    async distributeNewsletter(htmlContent) {
        try {
            // 1. Fetch active subscribers
            const { data: subscribers, error } = await supabase
                .from('newsletter_subscriptions')
                .select('email')
                .eq('is_active', true);

            if (error) throw error;
            if (!subscribers || subscribers.length === 0) {
                logger.info("No active subscribers for newsletter.");
                return { success: true, count: 0 };
            }

            logger.info(`Sending newsletter to ${subscribers.length} subscribers in batches...`);

            // 2. Batch Sending Logic (100 per chunk - Resend limit)
            const chunkSize = 100;
            const batches = [];
            for (let i = 0; i < subscribers.length; i += chunkSize) {
                batches.push(subscribers.slice(i, i + chunkSize));
            }

            let totalSent = 0;
            for (const batch of batches) {
                const batchPayload = batch.map(sub => ({
                    from: 'Lawlify Analytics <intelligence@lawlify.ai>',
                    to: [sub.email],
                    subject: 'Weekly Judicial Intelligence Report',
                    html: htmlContent
                }));

                await resend.batch.send(batchPayload);
                totalSent += batch.length;
                
                // 3. Staggered Delay (1s) to avoid rate limiting on free/entry tiers
                if (batches.length > 1) {
                    await new Promise(r => setTimeout(r, 1000));
                }
            }

            return { success: true, count: totalSent };
        } catch (error) {
            logger.error("Newsletter Distribution Error:", error);
            throw error;
        }
    }
}

export const newsletterService = new NewsletterService();
