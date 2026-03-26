import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { pageIndexService } from '../services/pageIndexService.js';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * GET /knowledge
 * List all legal documents in the knowledge base.
 */
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('knowledge_base')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        logger.error('Error fetching knowledge base:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /knowledge/status/:id
 * Poll PageIndex for cooking status and update DB accordingly.
 */
router.get('/status/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Ask PageIndex microservice for the current status
        const statusResult = await pageIndexService.getStatus(id);
        const indexStatus = statusResult?.status || 'unknown';

        // Map PageIndex status to our DB status
        let dbStatus = 'cooking';
        if (indexStatus === 'ready') dbStatus = 'ready';
        else if (indexStatus?.startsWith('error')) dbStatus = 'error';

        // Update DB if it changed to ready or error
        if (dbStatus === 'ready' || dbStatus === 'error') {
            await supabase
                .from('knowledge_base')
                .update({ status: dbStatus })
                .eq('id', id);
        }

        res.json({ status: indexStatus, document_id: id });
    } catch (error) {
        logger.error('Error checking cook status:', error.message);
        res.status(500).json({ status: 'error', error: error.message });
    }
});

/**
 * POST /knowledge/register
 * Register a new raw document and immediately trigger cooking.
 */
router.post('/register', async (req, res) => {
    const { title, country, category, year, file_path } = req.body;

    try {
        // 1. Insert into DB
        const { data, error } = await supabase
            .from('knowledge_base')
            .insert([{ title, country, category, year, file_path, status: 'cooking' }])
            .select()
            .single();

        if (error) throw error;

        // 2. Generate a 1-hour signed URL for PageIndex to access the file
        const { data: signedUrlData, error: signError } = await supabase.storage
            .from('raw-documents')
            .createSignedUrl(file_path, 3600);

        if (signError) {
            logger.warn(`Could not generate signed URL for ${file_path}: ${signError.message}`);
            // Still return success — admin can manually re-cook
            return res.json({ message: 'Document registered. Could not auto-trigger cook.', data });
        }

        // 3. Fire-and-forget: trigger PageIndex cook (don't await to keep response fast)
        pageIndexService.cookDocument(signedUrlData.signedUrl, data.id).catch(err => {
            logger.error(`Background cook failed for ${data.id}: ${err.message}`);
            supabase.from('knowledge_base').update({ status: 'error' }).eq('id', data.id);
        });

        res.json({ message: 'Document registered and cooking triggered', data });
    } catch (error) {
        logger.error('Error registering document:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /knowledge/recook
 * Re-trigger PageIndex cooking for a stuck or failed document.
 */
router.post('/recook', async (req, res) => {
    const { document_id, file_path } = req.body;

    if (!document_id || !file_path) {
        return res.status(400).json({ error: 'document_id and file_path are required' });
    }

    try {
        // 1. Get a fresh signed URL from raw-documents bucket
        const { data: signedUrlData, error: signError } = await supabase.storage
            .from('raw-documents')
            .createSignedUrl(file_path, 3600);

        if (signError) throw new Error(`Cannot generate signed URL: ${signError.message}`);

        // 2. Reset status to cooking
        await supabase
            .from('knowledge_base')
            .update({ status: 'cooking', index_path: null })
            .eq('id', document_id);

        // 3. Fire-and-forget cook
        pageIndexService.cookDocument(signedUrlData.signedUrl, document_id).catch(err => {
            logger.error(`Recook failed for ${document_id}: ${err.message}`);
            supabase.from('knowledge_base').update({ status: 'error' }).eq('id', document_id);
        });

        logger.info(`Recook triggered for document ${document_id}`);
        res.json({ message: 'Recook triggered successfully', document_id });
    } catch (error) {
        logger.error('Error triggering recook:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /knowledge/cook/:id
 * Manually trigger cooking by document ID only (admin convenience).
 */
router.post('/cook/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { data: doc, error: fetchError } = await supabase
            .from('knowledge_base').select('*').eq('id', id).single();

        if (fetchError || !doc) throw new Error('Document not found');

        const { data: signedUrlData, error: signError } = await supabase.storage
            .from('raw-documents').createSignedUrl(doc.file_path, 3600);

        if (signError) throw signError;

        await supabase.from('knowledge_base').update({ status: 'cooking' }).eq('id', id);

        pageIndexService.cookDocument(signedUrlData.signedUrl, id).catch(err => {
            logger.error(`Cook failed for ${id}: ${err.message}`);
            supabase.from('knowledge_base').update({ status: 'error' }).eq('id', id);
        });

        res.json({ message: 'Cooking triggered', document_id: id });
    } catch (error) {
        logger.error('Error triggering cook:', error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;

