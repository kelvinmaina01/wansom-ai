import express from 'express';
import { analyticsCoordinator } from '../services/AnalyticsCoordinator.js';
import { reportService } from '../services/reportService.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * GET /api/analytics/sweep
 * Autonomous trigger for the judicial analytics sweep.
 * PROTECTED: Requires CRON_SECRET header to match environment.
 */
router.all('/sweep', async (req, res) => {
    const cronSecret = req.headers['x-cron-secret'] || req.query.secret;
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret || cronSecret !== expectedSecret) {
        logger.warn("Unauthorized sweep attempt blocked.");
        return res.status(401).json({ error: "Unauthorized sweep trigger" });
    }

    try {
        logger.info("Manual/Triggered sweep started via API.");
        // Run sweep asynchronously (don't block the HTTP request)
        analyticsCoordinator.runWeeklySweep()
            .then(result => logger.info("Background sweep completed result:", result))
            .catch(err => logger.error("Background sweep failed:", err));

        res.json({ 
            success: true, 
            message: "Autonomous sweep triggered in background.",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error("Sweep Trigger Error:", error.message);
        res.status(500).json({ error: "Failed to trigger sweep" });
    }
});

/**
 * GET /api/analytics/test-connection
 * Sanity check for external legal APIs.
 */
router.get('/test-connection', async (req, res) => {
    try {
        const testTerm = "Mabeya"; // Common judge
        const { africanLIIService } = await import('../services/AfricanLIIService.js');
        const results = await africanLIIService.fetchRecentJudgments(testTerm);
        
        res.json({
            success: true,
            api: "AfricanLII",
            count_found: results.length,
            sample: results[0] || null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/analytics/reports/generate
 * Generates an on-demand AI intelligence report for a judge.
 */
router.post('/reports/generate', async (req, res) => {
    const { judgeId } = req.body;
    if (!judgeId) return res.status(400).json({ error: "judgeId is required" });

    try {
        const report = await reportService.generateIntelligenceReport(judgeId);
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/analytics/chat
 * Handles real-time follow-up questions about a judge.
 */
router.post('/chat', async (req, res) => {
    const { judgeId, question } = req.body;
    if (!judgeId || !question) return res.status(400).json({ error: "judgeId and question are required" });

    try {
        const answer = await reportService.handleChatFollowup(judgeId, question);
        res.json({ role: 'assistant', content: answer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
