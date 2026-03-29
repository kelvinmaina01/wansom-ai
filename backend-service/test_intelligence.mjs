import { intelligenceService } from './services/intelligenceService.js';
import dotenv from 'dotenv';

dotenv.config();

async function testIntelligence() {
    try {
        const service = intelligenceService;
        // Mock buffer for a basic contract
        const mockBuffer = Buffer.from(`
            LEASE AGREEMENT
            This Lease Agreement is made on this 27th day of March 2026, between 
            Landlord Co. of Dar es Salaam, Tanzania, and Tenant Ltd.
            The premises are located at Plot 123, Masaki, Dar es Salaam.
            The monthly rent shall be 2,000,000 TZS.
        `);
        const fileName = "lease_agreement_tanzania.pdf";
        
        console.log("Testing Autonomous Recognition with Gemini 2.0...");
        const result = await service._getSemanticAnalysis(mockBuffer, fileName, 'summary');
        
        console.log("\n--- AI RECOGNITION RESULTS ---");
        console.log("Jurisdiction:", result.jurisdiction);
        console.log("Document Type:", result.documentType);
        console.log("Suggested Prompts:", JSON.stringify(result.suggestedPrompts, null, 2));
        console.log("Summary:", result.summary);
        console.log("------------------------------\n");

        if (result.jurisdiction && result.documentType && result.suggestedPrompts?.length === 4) {
            console.log("SUCCESS: Autonomous recognition and dynamic prompting verified.");
        } else {
            console.warn("PARTIAL SUCCESS: Some metadata fields might be missing or malformed.");
        }
    } catch (e) {
        console.error("Test Error:", e);
    }
}

testIntelligence();
