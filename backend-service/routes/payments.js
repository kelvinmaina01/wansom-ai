import { Router } from 'express';
import crypto from 'crypto';
import logger from '../utils/logger.js';

const router = Router();

const PAYSTACK_BASE = 'https://api.paystack.co';

// ── Helper: call Paystack API ──
async function paystackRequest(method, path, body = null) {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) throw new Error('PAYSTACK_SECRET_KEY not configured');

    const opts = {
        method,
        headers: {
            Authorization: `Bearer ${secret}`,
            'Content-Type': 'application/json',
        },
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${PAYSTACK_BASE}${path}`, opts);
    const data = await res.json();
    if (!res.ok) {
        logger.error('[PAYSTACK] API error:', { path, status: res.status, data });
        throw new Error(data.message || 'Paystack API error');
    }
    return data;
}

// ── Plan Configuration ──
const PLAN_CONFIG = {
    personal: { name: 'Personal Plan', amount: 1500, credits: 500, interval: 'monthly', description: '500 credits/month · No daily reset' },
    teams:    { name: 'Teams Plan',    amount: 1500, credits: 800, interval: 'monthly', description: '800 credits/seat/month' },
    student:  { name: 'Student Plan',  amount: 750,  credits: 500, interval: 'monthly', description: '500 credits/month · 50% discount' },
    topup_50:   { name: '50 Credits Top-up',    amount: 200,  credits: 50,   interval: null, description: '50 non-expiring credits' },
    topup_150:  { name: '150 Credits Top-up',   amount: 500,  credits: 150,  interval: null, description: '150 non-expiring credits' },
    topup_500:  { name: '500 Credits Top-up',   amount: 1400, credits: 500,  interval: null, description: '500 non-expiring credits' },
    topup_1000: { name: '1,000 Credits Top-up', amount: 2500, credits: 1000, interval: null, description: '1,000 non-expiring credits' },
};

// ═══════════════════════════════════════════════════════════════
// POST /api/payments/initialize
// Called from frontend when user clicks "Pay". Creates a Paystack
// transaction and stores a pending record in our DB.
// ═══════════════════════════════════════════════════════════════
router.post('/initialize', async (req, res) => {
    try {
        const supabase = req.app.locals.supabase;
        if (!supabase) throw new Error('Supabase not initialized');

        const userId = req.user.id;
        const { plan, email, name, phone, paymentMethod, currency, seatCount } = req.body;

        // Validate plan
        const config = PLAN_CONFIG[plan];
        if (!config) return res.status(400).json({ error: `Invalid plan: ${plan}` });

        // Calculate amount (handle seat-based pricing for teams)
        let amount = config.amount;
        if (plan === 'teams' && seatCount > 1) {
            amount = config.amount * seatCount;
        }

        // Generate unique reference
        const reference = `LWF-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

        // Initialize with Paystack
        const paystackBody = {
            email: email || req.user.email,
            amount, // already in cents
            currency: currency || 'USD',
            reference,
            callback_url: `${process.env.FRONTEND_URL || 'https://lawlify-ai.vercel.app'}/payment/callback`,
            metadata: {
                plan,
                plan_name: config.name,
                credits: config.credits,
                userId,
                seatCount: seatCount || 1,
                custom_fields: [
                    { display_name: 'Plan', variable_name: 'plan', value: config.name },
                    { display_name: 'Credits', variable_name: 'credits', value: config.credits.toString() },
                ],
            },
            channels: paymentMethod === 'mobile_money'
                ? ['mobile_money']
                : paymentMethod === 'bank_transfer'
                    ? ['bank_transfer']
                    : ['card', 'bank', 'mobile_money', 'bank_transfer'],
        };

        const paystackRes = await paystackRequest('POST', '/transaction/initialize', paystackBody);

        // Store pending transaction in DB
        const { error: dbError } = await supabase
            .from('transactions')
            .insert([{
                user_id: userId,
                reference,
                paystack_reference: paystackRes.data.reference,
                amount,
                currency: currency || 'USD',
                status: 'pending',
                payment_method: paymentMethod || 'card',
                plan,
                plan_name: config.name,
                credits: config.credits * (plan === 'teams' ? (seatCount || 1) : 1),
                metadata: { seatCount, name, phone },
                ip_address: req.ip,
            }]);

        if (dbError) {
            logger.error('[PAYMENTS] DB insert error:', dbError);
            throw dbError;
        }

        logger.info(`[PAYMENTS] Transaction initialized: ${reference} for user ${userId}, plan: ${plan}`);

        res.json({
            success: true,
            reference,
            authorization_url: paystackRes.data.authorization_url,
            access_code: paystackRes.data.access_code,
        });

    } catch (error) {
        logger.error('[PAYMENTS] Initialize error:', { error: error.message });
        res.status(500).json({ error: 'Failed to initialize payment', details: error.message });
    }
});

// ═══════════════════════════════════════════════════════════════
// GET /api/payments/status/:reference
// Frontend polls this every 2s during the processing step.
// Returns the current transaction status from our DB.
// ═══════════════════════════════════════════════════════════════
router.get('/status/:reference', async (req, res) => {
    try {
        const supabase = req.app.locals.supabase;
        if (!supabase) throw new Error('Supabase not initialized');

        const { reference } = req.params;
        const userId = req.user.id;

        const { data: txn, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('reference', reference)
            .eq('user_id', userId)
            .single();

        if (error || !txn) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json({
            reference: txn.reference,
            status: txn.status,
            confirmed: txn.status === 'success',
            plan: txn.plan,
            plan_name: txn.plan_name,
            credits: txn.credits,
            amount: txn.amount,
            currency: txn.currency,
            verified_at: txn.verified_at,
        });

    } catch (error) {
        logger.error('[PAYMENTS] Status check error:', { error: error.message });
        res.status(500).json({ error: 'Failed to check payment status' });
    }
});

// ═══════════════════════════════════════════════════════════════
// GET /api/payments/history
// Returns user's transaction history for the billing page.
// ═══════════════════════════════════════════════════════════════
router.get('/history', async (req, res) => {
    try {
        const supabase = req.app.locals.supabase;
        if (!supabase) throw new Error('Supabase not initialized');

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;
        res.json(data || []);

    } catch (error) {
        logger.error('[PAYMENTS] History error:', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch payment history' });
    }
});

// ═══════════════════════════════════════════════════════════════
// POST /api/payments/subscribe
// Creates a Paystack subscription plan and initializes a
// subscription-based transaction.
// ═══════════════════════════════════════════════════════════════
router.post('/subscribe', async (req, res) => {
    try {
        const supabase = req.app.locals.supabase;
        if (!supabase) throw new Error('Supabase not initialized');

        const userId = req.user.id;
        const { plan, email, name, currency } = req.body;

        const config = PLAN_CONFIG[plan];
        if (!config || !config.interval) {
            return res.status(400).json({ error: 'Invalid subscription plan' });
        }

        // Create or retrieve Paystack plan
        // In production, you'd store plan_codes in a config table
        // For now, we create inline or use existing
        const reference = `LWF-SUB-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

        const paystackBody = {
            email: email || req.user.email,
            amount: config.amount,
            currency: currency || 'USD',
            reference,
            metadata: {
                plan,
                plan_name: config.name,
                credits: config.credits,
                userId,
                subscription: true,
            },
        };

        const paystackRes = await paystackRequest('POST', '/transaction/initialize', paystackBody);

        // Store pending transaction
        await supabase.from('transactions').insert([{
            user_id: userId,
            reference,
            paystack_reference: paystackRes.data.reference,
            amount: config.amount,
            currency: currency || 'USD',
            status: 'pending',
            plan,
            plan_name: config.name,
            credits: config.credits,
            metadata: { subscription: true, name },
        }]);

        logger.info(`[PAYMENTS] Subscription initialized: ${reference} for plan ${plan}`);

        res.json({
            success: true,
            reference,
            authorization_url: paystackRes.data.authorization_url,
            access_code: paystackRes.data.access_code,
        });

    } catch (error) {
        logger.error('[PAYMENTS] Subscribe error:', { error: error.message });
        res.status(500).json({ error: 'Failed to initialize subscription' });
    }
});

export default router;

// ═══════════════════════════════════════════════════════════════
// WEBHOOK HANDLER — exported separately because it needs
// raw body parsing (no JSON middleware) for HMAC verification.
// Mounted directly in index.js, NOT behind authenticate.
// ═══════════════════════════════════════════════════════════════
export async function paystackWebhookHandler(req, res) {
    try {
        const supabase = req.app.locals.supabase;
        if (!supabase) {
            logger.error('[WEBHOOK] Supabase not initialized');
            return res.sendStatus(500);
        }

        // 1. Verify HMAC-SHA512 signature
        const secret = process.env.PAYSTACK_SECRET_KEY;
        if (!secret) {
            logger.error('[WEBHOOK] PAYSTACK_SECRET_KEY not configured');
            return res.sendStatus(500);
        }

        const signature = req.headers['x-paystack-signature'];
        const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');

        if (hash !== signature) {
            logger.warn('[WEBHOOK] Invalid signature — possible tampering');
            return res.sendStatus(401);
        }

        const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        logger.info(`[WEBHOOK] Received event: ${event.event}`, { reference: event.data?.reference });

        if (event.event === 'charge.success') {
            const { reference, metadata, amount, currency, channel, authorization } = event.data;

            // 2. Double-verify with Paystack API (NEVER skip this)
            const verifyRes = await paystackRequest('GET', `/transaction/verify/${reference}`);
            if (verifyRes.data.status !== 'success') {
                logger.warn(`[WEBHOOK] Verification failed for ${reference}`);
                return res.sendStatus(200); // Return 200 to prevent retries
            }

            const userId = metadata?.userId;
            const plan = metadata?.plan;
            const credits = parseInt(metadata?.credits) || 0;

            if (!userId) {
                logger.error('[WEBHOOK] No userId in metadata', { reference });
                return res.sendStatus(200);
            }

            // 3. Update transaction status
            const { error: txnError } = await supabase
                .from('transactions')
                .update({
                    status: 'success',
                    channel: channel,
                    verified_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    metadata: { ...metadata, authorization_code: authorization?.authorization_code },
                })
                .eq('reference', reference);

            if (txnError) logger.error('[WEBHOOK] Transaction update error:', txnError);

            // 4. Update user credits and plan
            const { data: currentUser } = await supabase
                .from('user_settings')
                .select('credits_balance, billing_plan')
                .eq('id', userId)
                .single();

            const currentBalance = currentUser?.credits_balance || 0;
            const newBalance = currentBalance + credits;

            const planUpdate = {
                credits_balance: newBalance,
                updated_at: new Date().toISOString(),
            };

            // If it's a subscription plan (not a top-up), update the billing plan
            if (plan && !plan.startsWith('topup')) {
                planUpdate.billing_plan = plan.charAt(0).toUpperCase() + plan.slice(1); // 'personal' → 'Personal'
                planUpdate.credits_plan_allocation = credits;
                planUpdate.plan_expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
            }

            const { error: userError } = await supabase
                .from('user_settings')
                .update(planUpdate)
                .eq('id', userId);

            if (userError) logger.error('[WEBHOOK] User update error:', userError);

            // 5. Record in credit ledger
            await supabase.from('credit_ledger').insert([{
                user_id: userId,
                amount: credits,
                balance_after: newBalance,
                reason: plan?.startsWith('topup') ? 'topup' : 'purchase',
                reference,
                metadata: { plan, plan_name: metadata?.plan_name, channel },
            }]);

            // 6. Create subscription record if applicable
            if (metadata?.subscription && !plan?.startsWith('topup')) {
                await supabase.from('subscriptions').insert([{
                    user_id: userId,
                    plan,
                    plan_name: metadata.plan_name,
                    paystack_customer_code: event.data.customer?.customer_code,
                    status: 'active',
                    amount,
                    currency,
                    credits_per_cycle: credits,
                    next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                }]);
            }

            logger.info(`[WEBHOOK] ✓ Payment confirmed: ${reference} | +${credits} credits for user ${userId} | Plan: ${plan}`);
        }

        // Always return 200 to acknowledge receipt
        res.sendStatus(200);

    } catch (error) {
        logger.error('[WEBHOOK] Processing error:', { error: error.message });
        res.sendStatus(200); // Return 200 to prevent Paystack retries
    }
}
