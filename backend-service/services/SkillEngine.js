import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_BASE_INSTRUCTIONS = `You are an East Africa Legal AI Assistant.
You help users draft, review, and understand legal documents across
Kenya, Uganda, Tanzania, Rwanda, Burundi, South Sudan, and Ethiopia.

Core rules:
1. Always follow the jurisdiction skill's requirements exactly — statutory
   minimums cannot be contracted around.
2. Always follow the document skill's mandatory clause checklist.
3. Always apply the design skill's formatting standards.
4. If a user asks for something that would be illegal or unenforceable
   under the applicable law, flag it clearly.
5. End every document draft with the standard disclaimer.
6. If critical information is missing (jurisdiction, party names),
   ask before drafting rather than guessing.
7. Be precise about statute citations — always use the correct
   Act name and year for the jurisdiction.`;

class SkillEngine {
  constructor(skillsDir = path.join(__dirname, 'skills')) {
    this.skillsDir = skillsDir;
    this.registry = null;
    this._cache = {}; // skill_id -> content
    this._loadRegistry();
  }

  _loadRegistry() {
    try {
      const registryPath = path.join(this.skillsDir, 'REGISTRY.json');
      if (fs.existsSync(registryPath)) {
        this.registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
      }
    } catch (e) {
      logger.error('Error loading skills registry:', e.message);
    }
  }

  detectSkills(userMessage) {
    if (!this.registry) return [];
    const msg = userMessage.toLowerCase();
    const matched = [];

    // Basic trigger matching
    for (const skill of this.registry.skills) {
      if (skill.triggers.some(t => msg.includes(t.toLowerCase()))) {
        matched.push(skill.id);
      }
    }

    // Auto-load east-africa if 2+ jurisdictions detected (cross-border deal)
    const jurisdictionMatches = matched.filter(
      s => s.startsWith("jurisdiction-") && s !== "jurisdiction-east-africa"
    );
    if (jurisdictionMatches.length >= 2 && !matched.includes("jurisdiction-east-africa")) {
      matched.unshift("jurisdiction-east-africa");
    }

    // Auto-load design-templates whenever any doc- skill matches or requested
    const hasDocSkill = matched.some(s => s.startsWith("doc-"));
    const designSkillMeta = this.registry.skills.find(s => s.id === "design-templates");
    if (hasDocSkill || (designSkillMeta && designSkillMeta.auto_load_with_docs)) {
      if (!matched.includes("design-templates")) {
        matched.push("design-templates");
      }
    }

    return matched;
  }

  detectJurisdiction(userMessage) {
    const msg = userMessage.toLowerCase();
    for (const skill of this.registry.skills) {
      if (skill.id.startsWith('jurisdiction-')) {
        if (skill.triggers.some(t => msg.includes(t.toLowerCase()))) {
          return skill.id.replace('jurisdiction-', '');
        }
      }
    }
    return null;
  }

  missingInfo(userMessage) {
    if (!this.registry) return [];
    const gaps = [];
    const msg = userMessage.toLowerCase();

    const hasDoc = this.registry.skills.some(s => 
      s.id.startsWith('doc-') && s.triggers.some(t => msg.includes(t.toLowerCase()))
    );

    if (hasDoc) {
      if (!this.detectJurisdiction(userMessage)) {
        gaps.push(`Which country should govern this document? (We support: ${this.registry.jurisdictions.join(', ')})`);
      }
    }

    return gaps;
  }

  deepDetectJurisdiction(fullText) {
    if (!fullText) return null;
    const text = fullText.toLowerCase();
    
    // Load the signal dictionary from the jurisdiction-detection reference
    // This is a "hard-coded" logic extension based on the document-intelligence skill
    const signals = {
        'kenya': ['milimani', 'nairobi', 'mombasa', 'cap 226', 'eklr', 'kenya gazette'],
        'uganda': ['kampala', 'entebbe', 'ugsc', 'ugca', 'uganda gazette', 'laws of uganda'],
        'tanzania': ['dar es salaam', 'dodoma', 'tzca', 'tzhc', 'tanzania gazette'],
        'rwanda': ['kigali', 'kiac', 'rwf', 'rwandan franc'],
        'ethiopia': ['addis ababa', 'etb', 'birr', 'negarit gazette']
    };

    for (const [juris, keywords] of Object.entries(signals)) {
        if (keywords.some(k => text.includes(k))) {
            return juris;
        }
    }
    return null;
  }

  loadSkill(skillId) {
    if (this._cache[skillId]) return this._cache[skillId];

    const skillMeta = this.registry.skills.find(s => s.id === skillId);
    if (!skillMeta) return `[Skill '${skillId}' not found in registry]`;

    try {
      const skillPath = path.join(this.skillsDir, skillMeta.path);
      if (fs.existsSync(skillPath)) {
        let content = fs.readFileSync(skillPath, 'utf8');
        
        // Resolve references: look for lines like "- `references/file.md`" 
        // and inject their content or a clear marker.
        content = this._resolveReferences(content, path.dirname(skillPath));
        
        this._cache[skillId] = content;
        return content;
      }
    } catch (e) {
      logger.error(`Failed to read skill file ${skillId}:`, e.message);
    }
    return `[Skill file not found for ${skillId}]`;
  }

  _resolveReferences(content, baseDir) {
    const lines = content.split('\n');
    const resolvedLines = lines.map(line => {
      // Pattern: - `references/filename.md` ...
      const refMatch = line.match(/-\s+`?(references\/[\w-]+\.md)`?/);
      if (refMatch) {
        const refPath = path.join(baseDir, refMatch[1]);
        if (fs.existsSync(refPath)) {
          const refContent = fs.readFileSync(refPath, 'utf8');
          return `\n### REFERENCE: ${refMatch[1]}\n\n${refContent}\n\n---\n`;
        }
      }
      return line;
    });
    return resolvedLines.join('\n');
  }

  loadSkills(skillIds) {
    const loaded = {};
    for (const sid of skillIds) {
      loaded[sid] = this.loadSkill(sid);
    }
    return loaded;
  }

  buildPrompt(userMessage, extraSkillIds = null, baseInstructions = null) {
    const skillIds = this.detectSkills(userMessage);
    if (extraSkillIds) {
      extraSkillIds.forEach(sid => {
        if (!skillIds.includes(sid)) skillIds.push(sid);
      });
    }

    const loaded = this.loadSkills(skillIds);
    const base = baseInstructions || DEFAULT_BASE_INSTRUCTIONS;

    if (Object.keys(loaded).length === 0) return base;

    // Ordered: jurisdiction, then doc, then design
    const orderedIds = [
      ...skillIds.filter(sid => sid.startsWith('jurisdiction-')),
      ...skillIds.filter(sid => sid.startsWith('doc-')),
      ...skillIds.filter(sid => sid.startsWith('design-'))
    ];

    const skillBlocks = [];
    for (const sid of orderedIds) {
      if (loaded[sid]) {
        const label = sid.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        skillBlocks.push(`## ${label}\n\n${loaded[sid]}`);
      }
    }

    const skillsText = skillBlocks.join("\n\n---\n\n");

    const prompt = `${base}

═══════════════════════════════════════════════════
LOADED SKILLS FOR THIS REQUEST: ${orderedIds.join(", ")}
═══════════════════════════════════════════════════

${skillsText}

═══════════════════════════════════════════════════
END OF SKILL INSTRUCTIONS — Follow all of the above exactly.
═══════════════════════════════════════════════════`;

    return prompt;
  }

  buildSkillContext(userMessage) {
    const skillIds = this.detectSkills(userMessage);
    if (skillIds.length === 0) return null;

    const loaded = this.loadSkills(skillIds);
    
    const skillBlocks = [];
    for (const sid of skillIds) {
      if (loaded[sid]) {
        const label = sid.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        skillBlocks.push(`### DETERMINISTIC LEGAL KNOWLEDGE: ${label}\n${loaded[sid]}`);
      }
    }

    return skillBlocks.join("\n\n---\n\n");
  }

  describeLoadedSkills(userMessage) {
    const skillIds = this.detectSkills(userMessage);
    if (skillIds.length === 0) return "Using general legal knowledge (no specific skill matched)";

    const lines = skillIds.map(sid => {
      const label = sid.replace(/-/g, ' ')
        .replace('jurisdiction ', '(Jurisdiction) ')
        .replace('doc ', '(Document) ')
        .replace('design ', '(Design) ');
      return `  • ${label.replace(/\b\w/g, c => c.toUpperCase())}`;
    });
    return `Skills loaded:\n${lines.join('\n')}`;
  }
}

export const skillEngine = new SkillEngine();
