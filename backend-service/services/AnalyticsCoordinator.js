import { createClient } from '@supabase/supabase-js';
import { africanLIIService } from './AfricanLIIService.js';
import { judicialIntelligence } from './judicialIntelligence.js';
import { newsletterService } from './newsletterService.js';
import logger from '../utils/logger.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Analytics Coordinator
 * Orchestrates the full autonomous sweep: Fetch -> Parse -> Insights -> Newsletter.
 */
export class AnalyticsCoordinator {
    
    async runWeeklySweep() {
        logger.info("Starting Autonomous Weekly Sweep...");
        const executionStats = {
            judgesProcessed: 0,
            newJudgmentsFound: 0,
            parsedRulings: 0,
            emailsSent: 0
        };

        try {
            // 1. Fetch all judges to monitor
            const { data: judges, error: judgeFetchError } = await supabase
                .from('judges')
                .select('*');

            if (judgeFetchError) throw judgeFetchError;
            logger.info(`Monitoring ${judges.length} judges.`);

            const updatedJudges = [];
            const allNewRulings = [];

            // 2. Iterate and Harvest
            for (const judge of judges) {
                try {
                    logger.info(`Processing Judge: ${judge.name}`);
                    
                    // Fetch recent judgments from AfricanLII
                    const recentJudgments = await africanLIIService.fetchRecentJudgments(judge.name);
                    
                    if (recentJudgments.length > 0) {
                        executionStats.judgesProcessed++;
                        updatedJudges.push(judge);

                        for (const judgment of recentJudgments) {
                            try {
                                // Check if already exists
                                const { data: existing } = await supabase
                                    .from('judgments')
                                    .select('id')
                                    .eq('external_id', judgment.id)
                                    .single();

                                if (!existing) {
                                    // Insert raw judgment
                                    const { data: newJudgment, error: insError } = await supabase
                                        .from('judgments')
                                        .insert([{
                                            external_id: judgment.id,
                                            judge_id: judge.id,
                                            title: judgment.title,
                                            full_text: judgment.full_text,
                                            publication_date: judgment.date,
                                            court: judgment.court,
                                            url: judgment.url
                                        }])
                                        .select()
                                        .single();

                                    if (insError) throw insError;

                                    executionStats.newJudgmentsFound++;

                                    // 3. AI Parsing Pipeline
                                    const parseResult = await judicialIntelligence.parseJudgment(newJudgment.id, judgment.full_text);
                                    executionStats.parsedRulings++;
                                    
                                    allNewRulings.push({
                                        ...parseResult.data,
                                        title: judgment.title,
                                        judge_name: judge.name
                                    });

                                    // Mark as parsed
                                    await supabase.from('judgments').update({ is_parsed: true }).eq('id', newJudgment.id);
                                }
                            } catch (judgmentErr) {
                                logger.error(`Failed to process judgment ${judgment.id}:`, judgmentErr.message);
                                // Continue to next judgment
                            }
                        }

                        // 4. Refresh strategic insights for this judge
                        await judicialIntelligence.refreshInsights(judge.id);
                    }
                } catch (judgeErr) {
                    logger.error(`Critical error processing judge ${judge.name}:`, judgeErr.message);
                    // Continue to next judge
                }
            }

            // 5. Final Delivery: Newsletter
            if (allNewRulings.length > 0) {
                logger.info(`Generating weekly newsletter for ${allNewRulings.length} new rulings...`);
                const htmlContent = await newsletterService.composeWeeklyReport(allNewRulings, updatedJudges);
                const distribution = await newsletterService.distributeNewsletter(htmlContent);
                executionStats.emailsSent = distribution.count;
            } else {
                logger.info("No new rulings found this week. Skipping newsletter.");
            }

            logger.info("Sweep Completed Successfully.", executionStats);
            return { success: true, stats: executionStats };

        } catch (error) {
            logger.error("Sweep Execution Failed:", error);
            throw error;
        }
    }
}

export const analyticsCoordinator = new AnalyticsCoordinator();
