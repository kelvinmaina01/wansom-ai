import express from 'express';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import logger from '../utils/logger.js';

const router = express.Router();

// Supabase Initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * @route GET /api/workspaces/:workspaceId/members
 * @desc Get all members of a specific workspace
 */
router.get('/:workspaceId/members', async (req, res) => {
    try {
        const { workspaceId } = req.params;
        
        const { data, error } = await supabase
            .from('workspace_members')
            .select(`
                id,
                user_id,
                role,
                joined_at
            `)
            .eq('workspace_id', workspaceId);

        if (error) throw error;
        
        // Enhance with user profiles (from user_settings)
        const userIds = data.map(m => m.user_id);
        const { data: profiles, error: profileError } = await supabase
            .from('user_settings')
            .select('id, profile_name, profile_email, profile_avatar_url')
            .in('id', userIds);

        const enhancedMembers = data.map(member => ({
            ...member,
            profile: profiles?.find(p => p.id === member.user_id) || { profile_name: 'Unknown User', profile_email: '' }
        }));

        res.json({ success: true, members: enhancedMembers });
    } catch (error) {
        logger.error('Error fetching workspace members:', error.message);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
});

/**
 * @route POST /api/workspaces/:workspaceId/invite
 * @desc Generate a unique invitation link/token
 */
router.post('/:workspaceId/invite', async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { email, role = 'viewer' } = req.body;
        const inviterId = req.user.id;
        
        // Generate a secure 16-character token
        const token = crypto.randomBytes(16).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

        const { data, error } = await supabase
            .from('workspace_invitations')
            .insert([{
                workspace_id: workspaceId,
                email,
                role,
                inviter_id: inviterId,
                token,
                status: 'pending',
                expires_at: expiresAt.toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        
        res.json({ 
            success: true, 
            invitation: data,
            inviteLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/join/${token}`
        });
    } catch (error) {
        logger.error('Error creating invitation:', error.message);
        res.status(500).json({ error: 'Failed to create invitation' });
    }
});

/**
 * @route POST /api/workspaces/invitations/:invitationId/approve
 * @desc Admin approves a pending invitation -> adds user to workspace
 */
router.post('/invitations/:invitationId/approve', async (req, res) => {
    try {
        const { invitationId } = req.params;
        
        // 1. Get invitation details
        const { data: invite, error: inviteError } = await supabase
            .from('workspace_invitations')
            .select('*')
            .eq('id', invitationId)
            .single();

        if (inviteError || !invite) throw new Error('Invitation not found');
        if (invite.status !== 'pending') throw new Error('Invitation is no longer pending');

        // 2. Add as member (role can be updated here if admin chooses)
        const { error: memberError } = await supabase
            .from('workspace_members')
            .insert([{
                workspace_id: invite.workspace_id,
                user_id: invite.inviter_id, // Placeholder: in real flow we need the JOINER'S user_id
                role: invite.role
            }]);

        if (memberError) throw memberError;

        // 3. Mark invite as accepted
        await supabase
            .from('workspace_invitations')
            .update({ status: 'accepted' })
            .eq('id', invitationId);

        res.json({ success: true, message: 'Member approved and added' });
    } catch (error) {
        logger.error('Error approving member:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route PATCH /api/workspaces/members/:memberId
 * @desc Update a member's role
 */
router.patch('/members/:memberId', async (req, res) => {
    try {
        const { memberId } = req.params;
        const { role } = req.body;

        const { error } = await supabase
            .from('workspace_members')
            .update({ role })
            .eq('id', memberId);

        if (error) throw error;
        res.json({ success: true, message: 'Role updated successfully' });
    } catch (error) {
        logger.error('Error updating member role:', error.message);
        res.status(500).json({ error: 'Failed to update role' });
    }
});

/**
 * @route DELETE /api/workspaces/members/:memberId
 * @desc Remove a member from the workspace
 */
router.delete('/members/:memberId', async (req, res) => {
    try {
        const { memberId } = req.params;

        const { error } = await supabase
            .from('workspace_members')
            .delete()
            .eq('id', memberId);

        if (error) throw error;
        res.json({ success: true, message: 'Member removed successfully' });
    } catch (error) {
        logger.error('Error removing member:', error.message);
        res.status(500).json({ error: 'Failed to remove member' });
    }
});

export default router;
