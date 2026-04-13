-- ============================================================
-- LAWLIFY AI — Payments & Credits Schema
-- Paystack Integration (Custom UI, API-only)
-- ============================================================

-- 1. Transactions — every payment attempt
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reference TEXT UNIQUE NOT NULL,
    paystack_reference TEXT,
    amount INTEGER NOT NULL,                    -- in smallest currency unit (cents/kobo/pesewas)
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'abandoned')),
    payment_method TEXT,                        -- 'card', 'mobile_money', 'bank_transfer'
    channel TEXT,                               -- paystack channel: card, bank, ussd, mobile_money, bank_transfer
    plan TEXT,                                  -- 'free', 'personal', 'teams', 'student', 'topup'
    plan_name TEXT,                             -- display name: 'Personal Plan', '150 Credits Top-up'
    credits INTEGER NOT NULL DEFAULT 0,         -- credits to add on success
    metadata JSONB DEFAULT '{}'::jsonb,         -- extra info (seat count, billing cycle, etc)
    ip_address TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all transactions" ON public.transactions
    FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_reference ON public.transactions(reference);
CREATE INDEX idx_transactions_status ON public.transactions(status);

-- 2. Subscriptions — active recurring billing
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan TEXT NOT NULL,                         -- 'personal', 'teams', 'student'
    plan_name TEXT NOT NULL,
    paystack_subscription_code TEXT,
    paystack_plan_code TEXT,
    paystack_customer_code TEXT,
    paystack_email_token TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'paused', 'expired')),
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    interval TEXT NOT NULL DEFAULT 'monthly',
    credits_per_cycle INTEGER NOT NULL,
    next_billing_date TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all subscriptions" ON public.subscriptions
    FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);

-- 3. Credit Ledger — append-only audit trail of all credit changes
CREATE TABLE IF NOT EXISTS public.credit_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,                    -- positive = add, negative = consume
    balance_after INTEGER NOT NULL,             -- running balance after this entry
    reason TEXT NOT NULL,                       -- 'purchase', 'subscription_renewal', 'usage', 'daily_reset', 'topup', 'refund'
    reference TEXT,                             -- links to transaction reference
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own credit ledger" ON public.credit_ledger
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all credit ledger" ON public.credit_ledger
    FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX idx_credit_ledger_user_id ON public.credit_ledger(user_id);

-- 4. Extend user_settings with billing fields
ALTER TABLE public.user_settings
    ADD COLUMN IF NOT EXISTS credits_balance INTEGER DEFAULT 5,
    ADD COLUMN IF NOT EXISTS credits_plan_allocation INTEGER DEFAULT 5,
    ADD COLUMN IF NOT EXISTS billing_credits_used INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS paystack_customer_code TEXT,
    ADD COLUMN IF NOT EXISTS display_name TEXT,
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS phone TEXT;
