const { IntelligenceService } = require('./services/intelligenceService');
const logger = require('./lib/logger');
const path = require('path');
const fs = require('fs');

async function testIntelligence() {
    try {
        const service = new IntelligenceService();
        // Since we don't have a real file ID here easily without querying DB, 
        // we'll just test the _getSemanticAnalysis part by mocking a buffer
        const mockBuffer = Buffer.from("Sample Legal Document Content");
        const fileName = "test_contract.pdf";
        
        console.log("Testing Autonomous Recognition Prompt...");
        const result = await service._getSemanticAnalysis(mockBuffer, fileName, 'summary');
        
        console.log("RESULT METADATA:", {
            jurisdiction: result.jurisdiction,
            documentType: result.documentType,
            prompts: result.suggestedPrompts
        });

        if (result.jurisdiction && result.documentType && result.suggestedPrompts?.length === 4) {
            console.log("SUCCESS: Autonomous recognition verified.");
        } else {
            console.error("FAILURE: Some metadata fields are missing.");
        }
    } catch (e) {
        console.error("Test Error:", e);
    }
}

testIntelligence();
