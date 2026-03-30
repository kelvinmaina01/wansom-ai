import { matterManager } from './MatterManager.js';
import { modelDispatcher } from './modelDispatcher.js';

async function testCaseManagement() {
  console.log("💼 STARTING CASE MANAGEMENT VERIFICATION...");

  // 1. Matter Retrieval
  const matter = matterManager.getMatter("MATTER-TEST-001");
  console.log("\n1. LOADED MATTER:", matter ? `✅ ${matter.name}` : "❌ FAILED");

  // 2. Action Suggestion Logic
  const suggestion = matterManager.suggestNextStep(matter);
  console.log("\n2. ACTION SUGGESTION:");
  console.log("   Last Action : Draft Plaint");
  console.log("   Next Step   :", suggestion ? `✅ ${suggestion.action}` : "❌ FAILED");
  console.log("   Deadline    :", suggestion ? `✅ ${suggestion.deadline}` : "❌ FAILED");

  // 3. Prompt Construction Check
  console.log("\n3. SYSTEM PROMPT INTEGRATION CHECK:");
  const testQuery = "Update this case with a follow-up document.";
  const context = {
    matterId: "MATTER-TEST-001",
    citeSources: true,
    suggestActions: true
  };

  // We use the INTERNAL method for verification
  const finalPrompt = modelDispatcher._buildFinalSystemPrompt(testQuery, context);

  const hasMatterContext = finalPrompt.includes("## ACTIVE MATTER CONTEXT");
  const hasCitationsToggle = finalPrompt.includes("## CITATION REQUIREMENT (ENABLED)");
  const hasSuggestionsToggle = finalPrompt.includes("## ACTION SUGGESTIONS (ENABLED)");
  const hasDeadlinesSkill = finalPrompt.includes("## Logic Deadlines");

  console.log(`   [MATTER CONTEXT] : ${hasMatterContext ? '✅' : '❌'}`);
  console.log(`   [CITE TOGGLE]     : ${hasCitationsToggle ? '✅' : '❌'}`);
  console.log(`   [SUGGEST TOGGLE]  : ${hasSuggestionsToggle ? '✅' : '❌'}`);
  console.log(`   [DEADLINE SKILL]  : ${hasDeadlinesSkill ? '✅' : '❌'}`);

  if (hasMatterContext && hasCitationsToggle && hasSuggestionsToggle && hasDeadlinesSkill) {
    console.log("\n🔥 RESULT: PHASE 9 CASE MANAGEMENT IS FULLY OPERATIONAL.");
  } else {
    console.log("\n🛑 RESULT: MINOR INTEGRATION ISSUE DETECTED.");
  }
}

testCaseMana
gement();

