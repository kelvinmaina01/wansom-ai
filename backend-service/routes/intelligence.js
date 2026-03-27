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
        const filePath = file.storage_path || `${req.user.id}/${file.name}`;
        const { data: buffer, error: downloadError } = await supabase
            .storage
            .from('legal-documents')
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

/**
 * GET /api/intelligence/search/:fileId
 * Performs keyword search over a document and returns coordinates
 */
router.get('/search/:fileId', async (req, res) => {
    const { fileId } = req.params;
    const { q } = req.query;

    try {
        if (!q) return res.status(400).json({ error: 'Search query required' });
        const results = await intelligenceService.searchDocument(fileId, q);
        res.json({ success: true, results });
    } catch (error) {
        logger.error(`Search Error [${fileId}]:`, error.message);
        res.status(500).json({ error: 'Search failed' });
    }
});

/**
 * GET /api/intelligence/sessions
 * Returns all saved intelligence sessions for the user
 */
router.get('/sessions', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('intelligence_sessions')
            .select('*')
            .eq('user_id', req.user.id)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        logger.error(`Fetch Sessions Error:`, error.message);
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
});

/**
 * POST /api/intelligence/sessions
 * Creates or updates an intelligence session
 */
router.post('/sessions', async (req, res) => {
    const { id, file_id, name, summary, chat_history, metadata } = req.body;
    const userId = req.user.id;

    try {
        const sessionData = {
            user_id: userId,
            file_id,
            name,
            summary,
            chat_history,
            metadata,
            updated_at: new Date().toISOString()
        };

        let result;
        if (id) {
            // Update existing
            const { data, error } = await supabase
                .from('intelligence_sessions')
                .update(sessionData)
                .eq('id', id)
                .eq('user_id', userId)
                .select()
                .single();
            if (error) throw error;
            result = data;
        } else {
            // Create new
            const { data, error } = await supabase
                .from('intelligence_sessions')
                .insert([sessionData])
                .select()
                .single();
            if (error) throw error;
            result = data;
        }

        res.json({ success: true, session: result });
    } catch (error) {
        logger.error(`Save Session Error:`, error.message);
        res.status(500).json({ error: 'Failed to save session' });
    }
});

/**
 * GET /api/intelligence/sessions/:id
 * Fetches a specific intelligence session
 */
router.get('/sessions/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('intelligence_sessions')
            .select('*')
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        logger.error(`Fetch Session Error:`, error.message);
        res.status(500).json({ error: 'Session not found' });
    }
});

export default router;
