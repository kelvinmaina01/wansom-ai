// Separate dedicated skills route (mounted at /api/skills)
import express from 'express';
const router = express.Router();

// GET /api/skills
router.get('/', async (req, res) => {
  try {
    const { skillEngine } = await import('../services/SkillEngine.js');

    if (!skillEngine.registry || !skillEngine.registry.skills) {
      return res.status(500).json({ error: 'Skill registry not loaded' });
    }

    const skills = skillEngine.registry.skills.map((skill) => {
      let category = 'Intelligence';
      if (skill.id.startsWith('jurisdiction-')) category = 'Jurisdiction';
      else if (skill.id.startsWith('doc-')) category = 'Documents';
      else if (skill.id.startsWith('design-')) category = 'Design';
      else if (skill.id.startsWith('logic-')) category = 'Logic';

      const name = skill.id
        .replace(/^(jurisdiction-|doc-|design-|logic-)/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return {
        id: skill.id,
        name,
        category,
        auto_load: skill.auto_load_with_docs || false,
        trigger_count: skill.triggers?.length || 0,
      };
    });

    res.json({
      version: skillEngine.registry.version,
      jurisdictions: skillEngine.registry.jurisdictions,
      document_types: skillEngine.registry.document_types,
      skills,
    });
  } catch (error) {
    console.error('[Skills API] Error:', error.message);
    res.status(500).json({ error: 'Failed to load skills registry' });
  }
});

export default router;
