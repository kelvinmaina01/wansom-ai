import express from 'express';
import { intelligenceService } from '../services/intelligenceService.js';
import logger from '../utils/logger.js';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Initialize internal Supabase client for file fetching
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * GET /api/intelligence/analyze/:fileId
 * Main entry point for the S.A.V.R.E. immersive engine.
 * Performs deep semantic analysis and returns synchronized scroll/audio metadata.
 */
router.get('/analyze/:fileId', async (req, res) => {
    const { fileId } = req.params;
    const { mode = 'summary' } = req.query; // 'summary' or 'full'

    try {
        logger.info(`Starting Document Intelligence analysis for file: ${fileId} in ${mode} mode`);

        // 1. Fetch file record from DB
        const { data: file, error: fetchError } = await supabase
            .from('files')
            .select('*')
            .eq('id', fileId)
            .single();

        if (fetchError || !file) {
            return res.status(404).json({ error: 'File not found in Lawlify Vault' });
        }

        // 2. Download file buffer from storage
        // Determine path (assuming it's in the same structure as File Vault)
        const filePath = file.path || `uploads/${req.user.id}/${file.name}`;
        const { data: buffer, error: downloadError } = await supabase
            .storage
            .from('documents')
            .download(filePath);

        if (downloadError) {
            logger.error(`Failed to download file from storage: ${downloadError.message}`);
            return res.status(500).json({ error: 'Failed to access document storage' });
        }

        const arrayBuffer = await buffer.arrayBuffer();

        // 3. Hand off to Intelligence Engine (Zero Mocks)
        const analysis = await intelligenceService.processDocument(
            Buffer.from(arrayBuffer), 
            file.name, 
            { mode, userId: req.user.id }
        );

        res.json({
            success: true,
            fileId,
            fileName: file.name,
            ...analysis
        });

    } catch (error) {
        logger.error(`Intelligence Hub Error [${fileId}]:`, error.message);
        res.status(500).json({ 
            error: 'Failed to generate S.A.V.R.E. analysis',
            details: error.message 
        });
    }
});

/**
 * POST /api/intelligence/action
 * Handles selection-based AI actions (Replace, Explain, Rewrite)
 */
router.post('/action', async (req, res) => {
    const { fileId, selection, actionType } = req.body;

    try {
        const result = await intelligenceService.performAction(fileId, selection, actionType, req.user.id);
        res.json({ success: true, result });
    } catch (error) {
        logger.error(`Selection Action Error:`, error.message);
        res.status(500).json({ error: 'AI Action failed' });
    }
});

export default router;
