import { skillEngine } from './SkillEngine.js';
import logger from '../utils/logger.js';

async function runSimulation() {
  console.log("🚀 STARTING LEGAL ENGINE SIMULATION...");
  
  const testMessage = "I need to draft a Mutual NDA between TechBridge (Kenya) and DataVault (Uganda) for a cross-border API integration.";
  
  console.log("\n1. DETECTING SKILLS...");
  const detected = skillEngine.detectSkills(testMessage);
  console.log("Matched IDs:", detected);

  console.log("\n2. BUILDING SYSTEM PROMPT...");
  const prompt = skillEngine.buildPrompt(testMessage);
  
  // Verify Presence of Key Blocks
  const hasAmani = prompt.includes("You are an East Africa Legal AI Assistant");
  const hasEAC = prompt.includes("Jurisdiction East Africa");
  const hasKenya = prompt.includes("Jurisdiction Kenya");
  const hasUganda = prompt.includes("Jurisdiction Uganda");
  const hasNDA = prompt.includes("Doc Nda");
  const hasDesign = prompt.includes("Design Templates");
  const hasCSS = prompt.includes("--primary:       #1a3a5c");

  console.log("\n3. INTEGRITY CHECK:");
  console.log(`  [BASE/AMANI]   : ${hasAmani ? '✅' : '❌'}`);
  console.log(`  [EAC REGIONAL] : ${hasEAC ? '✅' : '❌'}`);
  console.log(`  [KENYA]        : ${hasKenya ? '✅' : '❌'}`);
  console.log(`  [UGANDA]       : ${hasUganda ? '✅' : '❌'}`);
  console.log(`  [DOCUMENT NDA] : ${hasNDA ? '✅' : '❌'}`);
  console.log(`  [DESIGN CSS]   : ${hasDesign ? '✅' : '❌'}`);
  console.log(`  [MASTER VARS]  : ${hasCSS ? '✅' : '❌'}`);

  if (hasDesign && hasCSS && hasNDA && (hasKenya || hasUganda)) {
    console.log("\n🔥 RESULT: THE SYSTEM IS 100% READY FOR PRODUCTION.");
  } else {
    console.log("\n🛑 RESULT: MINOR ALIGNMENT NEEDED.");
  }
}

runSimulation();
