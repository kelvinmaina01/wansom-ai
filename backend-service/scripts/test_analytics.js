import { createClient } from '@supabase/supabase-js';
import { judicialIntelligence } from '../services/judicialIntelligence.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testPipeline() {
    try {
        logger.info("Starting Pipeline Verification...");

        // 1. Find a judge
        const { data: judge } = await supabase
            .from('judges')
            .select('*')
            .eq('full_name', 'Justice Alfred Mabeya')
            .single();

        if (!judge) throw new Error("Seed judge not found");

        // 2. Insert a raw judgment record
        logger.info("Inserting raw judgment...");
        const { data: judgment, error: jugError } = await supabase
            .from('judgments')
            .insert([{
                judge_id: judge.id,
                case_name: 'Kenya Commercial Bank v Tech Solutions Ltd',
                case_number: 'HCCC/123/2023',
                citation: '[2023] eKLR',
                raw_text: `
                IN THE HIGH COURT OF KENYA AT NAIROBI
                COMMERCIAL AND TAX DIVISION
                RULING
                
                The Plaintiff, Kenya Commercial Bank, seeks an injunction against Tech Solutions Ltd...
                Having reviewed the Giella v Cassman Brown principles, I find that the Defendant has...
                The application for injunction is hereby DISMISSED with costs to the Defendant.
                Dated at Nairobi this 15th day of February 2023.
                Alfred Mabeya, Judge.
                `,
                source: 'kenya_law'
            }])
            .select()
            .single();

        if (jugError) throw jugError;

        // 3. Process with AI Parser
        logger.info("Running AI Parser on judgment...");
        const parseResult = await judicialIntelligence.parseJudgment(judgment.id, judgment.raw_text);
        logger.info("Parse successful:", parseResult.data);

        // 4. Verify Analytics View
        const { data: stats } = await supabase
            .from('judge_ruling_rates')
            .select('*')
            .eq('judge_id', judge.id);
        
        logger.info("Updated Analytics Stats:", stats);

        // 5. Generate Insights
        logger.info("Refreshing Insights...");
        const insResult = await judicialIntelligence.refreshInsights(judge.id);
        logger.info("New Insights generated:", insResult.insights.length);

        logger.info("VERIFICATION COMPLETE.");
        process.exit(0);
    } catch (error) {
        logger.error("Verification failed:", error);
        process.exit(1);
    }
}

testPipeline();
