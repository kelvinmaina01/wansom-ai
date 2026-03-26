// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, workspaceId, inviterName, workspaceName, role } = await req.json()

    // 1. Generate invitation token
    const token = crypto.randomUUID()
    
    // 2. Save to database
    const { data: inviter, error: inviterError } = await supabaseClient.auth.getUser(
      req.headers.get('Authorization')?.split('Bearer ')[1] ?? ''
    )
    
    if (inviterError || !inviter.user) {
      throw new Error('Unauthorized')
    }

    const { error: dbError } = await supabaseClient
      .from('workspace_invitations')
      .insert({
        workspace_id: workspaceId,
        email,
        role: role || 'viewer',
        inviter_id: inviter.user.id,
        token,
        status: 'pending'
      })

    if (dbError) throw dbError

    // 3. Send Email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [email],
      subject: `Invite to join ${workspaceName} on Lawlify AI`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Join ${workspaceName}</h2>
          <p>Hello,</p>
          <p><strong>${inviterName}</strong> has invited you to join their legal workspace on <strong>Lawlify AI</strong> as an <strong>${role || 'Member'}</strong>.</p>
          <div style="margin: 32px 0;">
            <a href="${Deno.env.get('FRONTEND_URL')}/join?token=${token}" 
               style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Accept Invitation
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">If you weren't expecting this invitation, you can ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="color: #999; font-size: 12px;">Lawlify AI - Premium Legal Technology</p>
        </div>
      `,
    })

    if (emailError) throw emailError

    return new Response(JSON.stringify({ success: true, data: emailData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
