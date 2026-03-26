import dotenv from 'dotenv';
import { intentClassifier } from './services/intentClassifier.js';
import { contextManager } from './services/contextManager.js';
import { followupGenerator } from './services/followupGenerator.js';
import { modelDispatcher } from './services/modelDispatcher.js';

dotenv.config();

async function testEngine() {
    console.log("🚀 Testing Lawlify AI: 5-Stage Structured Follow-up Engine\n");

    const testCases = [
        {
            name: "Ambiguous Drafting Request",
            query: "I need an NDA",
            context: {}
        },
        {
            name: "Partial Drafting Request",
            query: "Draft a freelance contract for a developer in Kenya",
            context: { providedContext: { jurisdiction: "Kenya", contract_type: "Freelance / Service" } }
        },
        {
            name: "Legal Advice - Research Needed",
            query: "Can I sue my landlord for mold in Kenya?",
            context: {}
        }
    ];

    for (const test of testCases) {
        console.log(`=== Test: ${test.name} ===`);
        console.log(`Query: "${test.query}"`);
        
        // 1. Stage 1: Classify Intent
        const intent = await intentClassifier.classify(test.query);
        console.log(`✅ Stage 1 (Intent): ${intent}`);

        // 2. Stage 2 & 3: Check Context
        const missing = contextManager.getMissingFields(intent, test.context.providedContext || {});
        if (missing.length > 0) {
            console.log(`📊 Gaps Found: ${missing.map(f => f.id).join(', ')}`);
            const followup = followupGenerator.generate(missing);
            console.log(`❓ Follow-up Question: "${followup.questions[0].text}"`);
        } else {
            console.log(`✨ All context present. Ready for generation.`);
        }

        // 3. Stage 4: Test Dispatch Stream (Dry run - check logic flow)
        console.log(`🌊 Testing Stream Logic...`);
        const generator = modelDispatcher.dispatchStream(test.query, { context: test.context });
        
        let foundStatus = false;
        let foundFollowup = false;
        
        for await (const chunk of generator) {
            if (chunk.type === 'status') {
                console.log(`  [STATUS] ${chunk.message}`);
                foundStatus = true;
            }
            if (chunk.type === 'followup') {
                console.log(`  [FOLLOWUP] Triggered successfully`);
                foundFollowup = true;
                break; // Stop for follow-up
            }
        }
        console.log("\n");
    }
}

testEngine().catch(err => console.error("❌ Test failed:", err));
