import express from 'express';
const router = express.Router();

// Receives the supabase client via app.locals
const getSupabase = (req) => req.app.locals.supabase;

// ============================================================
// ACTIVITY LOGS API  (mounted at /api/dashboard)
// ============================================================

// GET /api/dashboard/activity  — fetch recent activity for the user
router.get('/activity', async (req, res) => {
  try {
    const supabase = getSupabase(req);
    if (!supabase) return res.status(500).json({ error: 'DB not initialized' });

    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      // If table doesn't exist yet, return empty gracefully
      if (error.code === '42P01') return res.json([]);
      throw error;
    }

    res.json(data || []);
  } catch (error) {
    console.error('Activity logs error:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

// POST /api/dashboard/activity  — log an activity event
router.post('/activity', async (req, res) => {
  try {
    const supabase = getSupabase(req);
    if (!supabase) return res.status(500).json({ error: 'DB not initialized' });

    const { action, target, icon, case_id, metadata } = req.body;
    if (!action || !target) {
      return res.status(400).json({ error: 'action and target are required' });
    }

    const { data, error } = await supabase
      .from('activity_logs')
      .insert([{
        user_id: req.user.id,
        case_id: case_id || null,
        action,
        target,
        icon: icon || 'FileText',
        metadata: metadata || {},
      }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Log activity error:', error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

// ============================================================
// USER STATS API
// ============================================================

// GET /api/dashboard/stats  — fetch or create user stats
router.get('/stats', async (req, res) => {
  try {
    const supabase = getSupabase(req);
    if (!supabase) return res.status(500).json({ error: 'DB not initialized' });

    // 1. Fetch stored user_stats row
    let { data: stats, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // Table doesn't exist yet
      if (error.code === '42P01') {
        return res.json(buildDefaultStats());
      }
      throw error;
    }

    if (!stats) {
      // Auto-provision stats row for this user
      const { data: newStats, error: insertErr } = await supabase
        .from('user_stats')
        .insert([{ user_id: req.user.id }])
        .select()
        .single();

      if (insertErr && insertErr.code !== '42P01') throw insertErr;
      stats = newStats || {};
    }

    // 2. Enrich with live computed data from other tables
    const [{ count: activeProjects }, { count: totalQueries }, { count: draftsCreated }] = await Promise.all([
      supabase.from('cases').select('*', { count: 'exact', head: true }).eq('user_id', req.user.id).neq('status', 'Archived'),
      supabase.from('legal_messages').select('*', { count: 'exact', head: true }).eq('role', 'user').in(
        'chat_history_id',
        (await supabase.from('chat_histories').select('id').eq('user_id', req.user.id)).data?.map(c => c.id) || []
      ),
      supabase.from('drafts').select('*', { count: 'exact', head: true }).eq('user_id', req.user.id),
    ]);

    // 3. Merge computed + stored
    const enriched = {
      ...buildDefaultStats(),
      ...stats,
      active_projects: activeProjects || 0,
      total_queries: totalQueries || 0,
      drafts_created: draftsCreated || 0,
    };

    res.json(enriched);
  } catch (error) {
    console.error('Stats error:', error);
    // Return default stats gracefully so dashboard doesn't break
    res.json(buildDefaultStats());
  }
});

// PATCH /api/dashboard/stats  — update specific stats fields (e.g., after AI interaction)
router.patch('/stats', async (req, res) => {
  try {
    const supabase = getSupabase(req);
    if (!supabase) return res.status(500).json({ error: 'DB not initialized' });

    const allowed = [
      'ai_credits_used', 'ai_credits_total',
      'monthly_revenue', 'billable_hours', 'billable_target',
      'outstanding_invoices', 'pending_invoices_count',
      'statutes_indexed', 'time_saved_hours',
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('user_stats')
      .upsert({ user_id: req.user.id, ...updates }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ error: 'Failed to update stats' });
  }
});

function buildDefaultStats() {
  return {
    total_queries: 0,
    active_projects: 0,
    time_saved_hours: 0,
    statutes_indexed: 450,
    monthly_revenue: 0,
    billable_hours: 0,
    billable_target: 180,
    outstanding_invoices: 0,
    pending_invoices_count: 0,
    ai_credits_used: 0,
    ai_credits_total: 10000,
    docs_processed: 0,
    drafts_created: 0,
  };
}

export default router;
