import { skillEngine } from './SkillEngine.js';
import logger from '../utils/logger.js';

async function runComprehensiveTest() {
  console.log("🔍 STARTING COMPREHENSIVE SKILL ENGINE INTEGRATION TEST...");

  const testCases = [
    {
      name: "Kenya NDA",
      message: "I need a non-disclosure agreement for a startup in Nairobi.",
      expected: ["jurisdiction-kenya", "doc-nda", "design-templates"]
    },
    {
      name: "Uganda Employment",
      message: "Draft an employment contract for a clerk in Kampala, Uganda.",
      expected: ["jurisdiction-uganda", "doc-employment", "design-templates"]
    },
    {
      name: "Cross-Border (Kenya & Tanzania)",
      message: "We need a partnership deal between a Kenyan firm and a Tanzanian entity.",
      expected: ["jurisdiction-east-africa", "jurisdiction-kenya", "jurisdiction-tanzania", "doc-partnership", "design-templates"]
    },
    {
      name: "Ethiopia Court Filing",
      message: "How do I file a plaint in Addis Ababa?",
      expected: ["jurisdiction-ethiopia", "doc-court-filing", "design-templates"]
    },
    {
      name: "Document Intelligence",
      message: "Please review this document I uploaded.",
      expected: ["doc-intelligence"]
    }
  ];

  let passed = 0;

  for (const tc of testCases) {
    console.log(`\nTEST CASE: ${tc.name}`);
    const detected = skillEngine.detectSkills(tc.message);
    const prompt = skillEngine.buildPrompt(tc.message);

    const missing = tc.expected.filter(e => !detected.includes(e));
    const hasStructuralTags = prompt.includes("<state>") && prompt.includes("<thought>") && prompt.includes("<component");

    if (missing.length === 0 && hasStructuralTags) {
      console.log(`✅ PASSED: Detected [${detected.join(', ')}] and contains structural tags.`);
      passed++;
    } else {
      console.log(`❌ FAILED: Missing skills: [${missing.join(', ')}]. Has structural tags: ${hasStructuralTags}`);
    }
  }

  console.log(`\n=========================================`);
  console.log(`RESULT: ${passed}/${testCases.length} TESTS PASSED.`);
  console.log(`=========================================`);

  if (passed === testCases.length) {
    console.log("\n🔥 INTEGRATION VERIFIED: Skill Engine is fully operational.");
    process.exit(0);
  } else {
    console.log("\n🛑 VERIFICATION FAILED: Check trigger patterns.");
    process.exit(1);
  }
}

runComprehensiveTest();
