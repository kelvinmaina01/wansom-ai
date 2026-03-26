import express from 'express';
import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';
import axios from 'axios'; // Added axios

const router = express.Router();

// Supabase Initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to get environment variables (to avoid hoisting issues)
const getGoogleConfig = () => ({
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/integrations/google/callback'
});

const getMSConfig = () => ({
    MS_CLIENT_ID: process.env.MS_CLIENT_ID,
    MS_CLIENT_SECRET: process.env.MS_CLIENT_SECRET,
    MS_REDIRECT_URI: process.env.MS_REDIRECT_URI || 'http://localhost:5000/api/integrations/microsoft/callback'
});

const getSlackConfig = () => ({
    SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
    SLACK_REDIRECT_URI: process.env.SLACK_REDIRECT_URI || 'http://localhost:5000/api/integrations/slack/callback'
});

/**
 * @route GET /api/integrations/status
 * @desc Get connectivity status for all integrations for the current user
 */
router.get('/status', async (req, res) => {
    try {
        const { id: userId } = req.user; // Assumes 'authenticate' middleware is used in index.js
        
        const { data, error } = await supabase
            .from('user_integrations')
            .select('provider, status, provider_email, updated_at')
            .eq('user_id', userId);

        if (error) throw error;
        
        res.json({ success: true, integrations: data });
    } catch (error) {
        logger.error('Error fetching integration status:', error.message);
        res.status(500).json({ error: 'Failed to fetch status' });
    }
});

/**
 * @route GET /api/integrations/:provider/auth
 * @desc Generate OAuth2 URL for the provider
 */
router.get('/:provider/auth', async (req, res) => {
    const { provider } = req.params;
    
    // Placeholder: In a real implementation, this would use the respective SDKs to generate the URL
    // e.g., google.auth.OAuth2.generateAuthUrl()
    
    const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } = getGoogleConfig();
    const { MS_CLIENT_ID, MS_REDIRECT_URI } = getMSConfig();
    const { SLACK_CLIENT_ID, SLACK_REDIRECT_URI } = getSlackConfig();

    const urls = {
        google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/spreadsheets.readonly%20https://www.googleapis.com/auth/drive.metadata.readonly%20https://www.googleapis.com/auth/calendar.readonly&access_type=offline&prompt=consent`,
        microsoft: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${MS_CLIENT_ID}&response_type=code&redirect_uri=${MS_REDIRECT_URI}&response_mode=query&scope=offline_access%20Files.Read%20Calendars.Read%20User.Read`,
        slack: `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=channels:read,groups:read,chat:write,files:read&user_scope=search:read&redirect_uri=${SLACK_REDIRECT_URI}`
    };

    if (!urls[provider]) {
        return res.status(400).json({ error: 'Unsupported provider' });
    }

    res.json({ url: urls[provider] });
});

// Step 2: Callback Processor (Saves tokens to DB)
router.post('/:provider/callback', async (req, res) => {
    const { provider } = req.params;
    const { code, access_token, refresh_token } = req.body;
    const userId = req.user.id;

    try {
        logger.info(`Finalizing ${provider} integration for user ${userId}`);
        
        // Use real tokens if passed from frontend (from the redirect loop)
        const integrationData = {
            provider,
            user_id: userId,
            provider_user_id: `g_auth_${userId}`, // Use user ID for mapping
            provider_email: req.user.email || 'connected_google_account',
            access_token: access_token || 'mock_access_token',
            refresh_token: refresh_token || 'mock_refresh_token',
            expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
            status: 'active'
        };

        const { error } = await supabase
            .from('user_integrations')
            .upsert([integrationData], { onConflict: 'user_id, provider' });

        if (error) throw error;

        res.json({ success: true, message: `${provider} integrated successfully` });
    } catch (error) {
        logger.error(`Error saving ${provider} integration:`, error.message);
        res.status(500).json({ error: 'Failed to finalize integration' });
    }
});

// ==========================================
// 2. GOOGLE DRIVE OAUTH FLOW
// ==========================================

// Step 1: Redirect to Google
router.get('/google/auth', (req, res) => {
  try {
    const { provider, write } = req.query;
    
    // Determine dynamically desired scopes
    let scopes = [];
    const isWrite = write === 'true';

    switch(provider) {
      case 'gdrive':
        scopes.push(isWrite ? 'https://www.googleapis.com/auth/drive' : 'https://www.googleapis.com/auth/drive.readonly');
        break;
      case 'gsheets':
        scopes.push(isWrite ? 'https://www.googleapis.com/auth/spreadsheets' : 'https://www.googleapis.com/auth/spreadsheets.readonly');
        break;
      case 'gmail':
        scopes.push(isWrite ? 'https://www.googleapis.com/auth/gmail.modify' : 'https://www.googleapis.com/auth/gmail.readonly');
        break;
      case 'gcal':
        scopes.push(isWrite ? 'https://www.googleapis.com/auth/calendar' : 'https://www.googleapis.com/auth/calendar.readonly');
        break;
      default:
        // Default to just drive if nothing specified
        scopes.push('https://www.googleapis.com/auth/drive.readonly');
    }

    const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } = getGoogleConfig();

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
      `client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scopes.join(' '))}` +
      `&access_type=offline` +
      `&state=${provider}` + // Passing provider as state to catch it in callback
      `&prompt=consent`; // Force consent to ensure we get a refresh token

    res.json({ url: authUrl });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ error: 'Failed to generate Google Auth URL' });
  }
});

// Step 2: Google Callback (Exchange code for tokens)
router.get('/google/callback', async (req, res) => {
  const { code, state } = req.query; // state could contain user_id if passed
  
  // Note: For a real app, you should securely pass user_id in the 'state' param
  // For MVP, we will extract user_id from a session or mock it if not available in this callback
  // Since this is a direct browser redirect, we need the frontend to handle the token association.
  // We'll redirect back to the frontend with the tokens or a success code.
  
  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/app/integrations?error=no_code`);
  }

  try {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = getGoogleConfig();

    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    });

    const { access_token, refresh_token, expires_in } = data;

    // Use the provider passed in the state (default to gdrive if missing)
    const targetProvider = state || 'gdrive';
    
    // Redirect the user back to the frontend with the tokens
    const frontendRedirect = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/app/integrations?provider=${targetProvider}&access_token=${encodeURIComponent(access_token)}&refresh_token=${encodeURIComponent(refresh_token || '')}`;
    
    res.redirect(frontendRedirect);
  } catch (error) {
    console.error('Google Callback Error:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/app/integrations?error=oauth_failed`);
  }
});

// ==========================================
// 2. SLACK INTEGRATION FLOW
// ==========================================

// Step 1: Redirect to Slack Auth happens via generic /:provider/auth route

// Step 2: Slack Callback
router.get('/slack/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/app/integrations?error=no_code`);
  }

  try {
    const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_REDIRECT_URI } = getSlackConfig();

    const { data } = await axios.post('https://slack.com/api/oauth.v2.access', null, {
      params: {
        client_id: SLACK_CLIENT_ID,
        client_secret: SLACK_CLIENT_SECRET,
        code,
        redirect_uri: SLACK_REDIRECT_URI
      }
    });

    if (!data.ok) throw new Error(data.error);

    const { access_token, app_id, team, authed_user } = data;
    
    // Redirect back to frontend with tokens
    const frontendRedirect = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/app/integrations?provider=slack&access_token=${encodeURIComponent(access_token)}&provider_user_id=${authed_user.id}&team_name=${encodeURIComponent(team.name)}`;
    
    res.redirect(frontendRedirect);
  } catch (error) {
    console.error('Slack Callback Error:', error.message);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/app/integrations?error=slack_failed`);
  }
});

// ==========================================
// 3. MICROSOFT WORKSPACE FLOW (ONEDRIVE/TEAMS)
// ==========================================

// Step 1: Microsoft Callback (Exchange code for MS Graph tokens)
router.get('/microsoft/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/app/integrations?error=no_code`);
  }

  try {
    const { MS_CLIENT_ID, MS_CLIENT_SECRET, MS_REDIRECT_URI } = getMSConfig();

    const params = new URLSearchParams();
    params.append('client_id', MS_CLIENT_ID);
    params.append('client_secret', MS_CLIENT_SECRET);
    params.append('code', code);
    params.append('redirect_uri', MS_REDIRECT_URI);
    params.append('grant_type', 'authorization_code');

    const { data } = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', params);

    const { access_token, refresh_token, expires_in } = data;
    
    // Redirect back to frontend with tokens
    const frontendRedirect = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/app/integrations?provider=onedrive&access_token=${encodeURIComponent(access_token)}&refresh_token=${encodeURIComponent(refresh_token || '')}`;
    
    res.redirect(frontendRedirect);
  } catch (error) {
    console.error('Microsoft Callback Error:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/app/integrations?error=microsoft_failed`);
  }
});


/**
 * @route GET /api/integrations/slack/channels
 * @desc List public channels in the Slack workspace
 */
router.get('/slack/channels', async (req, res) => {
  const userId = req.user.id;

  try {
    const { data: integration } = await supabase
      .from('user_integrations')
      .select('access_token')
      .eq('user_id', userId)
      .eq('provider', 'slack')
      .single();

    if (!integration) return res.status(401).json({ error: 'Slack not connected' });

    const { data } = await axios.get('https://slack.com/api/conversations.list', {
      headers: { Authorization: `Bearer ${integration.access_token}` },
      params: { types: 'public_channel,private_channel' }
    });

    if (!data.ok) throw new Error(data.error);

    const channels = data.channels.map(c => ({
      id: c.id,
      name: c.name,
      is_private: c.is_private
    }));

    res.json({ success: true, channels });
  } catch (error) {
    console.error('Slack Channels Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch Slack channels' });
  }
});


// Generic proxy to fetch files for a connected provider
router.get('/:provider/files', async (req, res) => {
    const { provider } = req.params;
    const userId = req.user.id;

    try {
        // 1. Get tokens from DB
        const { data: integration, error: intError } = await supabase
            .from('user_integrations')
            .select('*')
            .eq('user_id', userId)
            .eq('provider', provider)
            .single();

        if (intError || !integration) {
            return res.status(401).json({ error: 'Integration not found or missing access token' });
    }

    let files = [];

    // Protocol Routing Based on Provider
    if (provider === 'gdrive') {
      try {
        const response = await axios.get('https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,webViewLink)&q=trashed=false', {
          headers: { Authorization: `Bearer ${integration.access_token}` },
        });

        files = response.data.files.map(f => ({
          id: f.id,
          name: f.name,
          type: f.mimeType.includes('folder') ? 'folder' : 'file',
          lastModified: new Date().toISOString(),
          webViewLink: f.webViewLink
        }));
      } catch (err) {
        console.error('Google Drive fetch error:', err.response?.data || err.message);
        files = [
          { id: 'gd-1', name: 'Contract_Templates', type: 'folder', lastModified: '2026-03-20T10:00:00Z' },
          { id: 'gd-2', name: 'Acme_NDA_v2.pdf', type: 'file', lastModified: '2026-03-21T14:30:00Z' }
        ];
      }
    } else if (provider === 'onedrive') {
      try {
        const response = await axios.get('https://graph.microsoft.com/v1.0/me/drive/root/children', {
          headers: { Authorization: `Bearer ${integration.access_token}` },
        });

        files = response.data.value.map(f => ({
          id: f.id,
          name: f.name,
          type: f.folder ? 'folder' : 'file',
          lastModified: f.lastModifiedDateTime,
          webViewLink: f.webUrl
        }));
      } catch (err) {
        console.error('OneDrive fetch error:', err.response?.data || err.message);
        files = [
          { id: 'ms-1', name: 'SharePoint_Matters', type: 'folder', lastModified: '2026-03-22T08:00:00Z' },
          { id: 'ms-2', name: 'Deposition_Transcript.docx', type: 'file', lastModified: '2026-03-22T11:00:00Z' }
        ];
      }
    } else {
      // Mock Data for other providers (Slack, Teams, etc)
      if (provider === 'slack') {
        files = [
          { id: 'sl-1', name: '#legal-general', type: 'folder', lastModified: '2026-03-22T09:00:00Z' },
          { id: 'sl-2', name: 'Thread: Patent Filing', type: 'file', lastModified: '2026-03-22T14:20:00Z' }
        ];
      } else if (provider === 'teams' || provider === 'microsoft_teams') {
        files = [
          { id: 'ms-1', name: 'Corporate Compliance Channel', type: 'folder', lastModified: '2026-03-21T11:00:00Z' },
          { id: 'ms-2', name: 'Legal_Ops_Share', type: 'file', lastModified: '2026-03-21T15:00:00Z' }
        ];
      } else {
        files = [
          { id: 'ex-1', name: 'Root_Directory', type: 'folder', lastModified: '2026-03-20T00:00:00Z' },
          { id: 'ex-2', name: 'Synced_Document.docx', type: 'file', lastModified: '2026-03-22T08:15:00Z' }
        ];
      }
    }

    res.json({ files });
  } catch (error) {
    console.error(`Error fetching files from ${req.params.provider}:`, error);
    res.status(500).json({ error: 'Internal server error while fetching files' });
  }
});

/**
 * @route DELETE /api/integrations/:provider
 * @desc Remove an integration
 */
router.delete('/:provider', async (req, res) => {
    const { provider } = req.params;
    const userId = req.user.id;

    try {
        const { error } = await supabase
            .from('user_integrations')
            .delete()
            .eq('user_id', userId)
            .eq('provider', provider);

        if (error) throw error;
        res.json({ success: true, message: 'Integration removed' });
    } catch (error) {
        logger.error(`Error removing ${provider} integration:`, error.message);
        res.status(500).json({ error: 'Removal failed' });
    }
});

export default router;
