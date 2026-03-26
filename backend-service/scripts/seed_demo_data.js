import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import { judicialIntelligence } from '../services/judicialIntelligence.js';

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
    try {
        logger.info("Starting High-Fidelity Data Seed...");

        // 1. Get Judge IDs
        const { data: judges } = await supabase.from('judges').select('id, full_name');
        const mabeya = judges.find(j => j.full_name.includes('Mabeya'));
        const ngugi = judges.find(j => j.full_name.includes('Ngugi'));
        const odunga = judges.find(j => j.full_name.includes('Odunga'));

        if (!mabeya || !ngugi) throw new Error("Base judges not found. Run seed_intel.js first.");

        // 2. Clear old demo rulings (keep current ones manually added if any)
        // await supabase.from('rulings').delete().neq('id', '...');

        // 3. Batch insert judgments for Mabeya (Goal: ~312 cases analyzed)
        const caseTypes = ['commercial', 'banking', 'insolvency', 'injunctions'];
        const outcomes = ['allowed', 'dismissed', 'partially_allowed'];

        logger.info("Generating ~300 judgments for Justice Mabeya...");
        for (let i = 0; i < 312; i++) {
            const caseType = i < 142 ? 'commercial' : (i < 231 ? 'banking' : (i < 265 ? 'insolvency' : 'injunctions'));
            // Deterministic outcomes to match screenshot win rates approx
            // Commercial: 68% allow
            let outcome = outcomes[Math.floor(Math.random() * 3)];
            if (caseType === 'commercial') outcome = Math.random() < 0.68 ? 'allowed' : 'dismissed';
            if (caseType === 'banking') outcome = Math.random() < 0.44 ? 'allowed' : 'dismissed';
            if (caseType === 'insolvency') outcome = Math.random() < 0.71 ? 'allowed' : 'dismissed';
            if (caseType === 'injunctions') outcome = Math.random() < 0.38 ? 'allowed' : 'dismissed';

            const { data: judgment } = await supabase.from('judgments').insert([{
                judge_id: mabeya.id,
                case_name: `Case Ref ${Math.random().toString(36).substring(7)}`,
                case_number: `HCCC/${i}/2023`,
                citation: `[2023] eKLR ${i}`,
                case_type: caseType
            }]).select().single();

            await supabase.from('rulings').insert([{
                judgment_id: judgment.id,
                judge_id: mabeya.id,
                outcome: outcome,
                case_type: caseType,
                matter_summary: "Automated analysis of historical commercial ruling."
            }]);
        }

        // 4. Seed common citations for Mabeya 
        const topCites = [
            { case: "Donoghue v Stevenson [1932] AC 562", count: 28 },
            { case: "Mombasa Hardware v Premier Finance [2018] eKLR", count: 24 },
            { case: "Republic v Kenya Revenue Authority [2019] eKLR", count: 19 },
            { case: "National Bank of Kenya v Pipeplastic [2001] EA", count: 17 }
        ];

        for (const cite of topCites) {
            await supabase.from('citations').upsert({
                judge_id: mabeya.id,
                cited_case: cite.case,
                times_cited: cite.count,
                case_types: ['commercial']
            }, { onConflict: 'judge_id,cited_case' });
        }

        // 5. Seed Insights for Mabeya
        const insights = [
            { type: 'style', text: "Prepare detailed written submissions — Justice Mabeya rarely interrupts oral arguments and decides heavily on the written record.", conf: 'high' },
            { type: 'preference', text: "Cite Company Law precedents from the UK Court of Appeal, which appear in 34% of his commercial rulings.", conf: 'high' },
            { type: 'tip', text: "Lead with documentary evidence and financial statements rather than witness testimony in banking disputes.", conf: 'medium' },
            { type: 'caution', text: "Injunction applications have a 38% allow rate — ensure you can demonstrate irreparable harm with financial evidence.", conf: 'medium' }
        ];

        for (const ins of insights) {
            await supabase.from('judge_insights').insert([{
                judge_id: mabeya.id,
                insight_type: ins.type,
                insight_text: ins.text,
                confidence: ins.conf,
                based_on_n: 312
            }]);
        }

        logger.info("Demo data seeding complete for Justice Mabeya.");
        process.exit(0);
    } catch (err) {
        logger.error("Seeding failed:", err);
        process.exit(1);
    }
}

seed();
