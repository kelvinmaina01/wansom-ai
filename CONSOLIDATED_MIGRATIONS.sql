-- ============================================================
-- LAWLIFY AI — CONSOLIDATED MASTER MIGRATION
-- Contents: Payments Schema, Credit Ledger, Support Categorization
-- ============================================================

-- 1. Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reference TEXT UNIQUE NOT NULL,
    paystack_reference TEXT,
    amount INTEGER NOT NULL,                    -- in smallest currency unit (cents/kobo/pesewas)
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'abandoned')),
    payment_method TEXT,                        -- 'card', 'mobile_money', 'bank_transfer'
    channel TEXT,                               -- paystack channel
    plan TEXT,                                  -- 'free', 'personal', 'teams', 'student', 'topup'
    plan_name TEXT,                             -- display name: 'Personal Plan'
    credits INTEGER NOT NULL DEFAULT 0,         -- credits to add on success
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);

-- 2. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    paystack_subscription_code TEXT,
    paystack_plan_code TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    next_billing_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- 3. Credit Ledger Table
CREATE TABLE IF NOT EXISTS public.credit_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    reason TEXT NOT NULL,
    reference TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own credit ledger" ON public.credit_ledger FOR SELECT USING (auth.uid() = user_id);

-- 4. Extend user_settings Table
ALTER TABLE public.user_settings
    ADD COLUMN IF NOT EXISTS credits_balance INTEGER DEFAULT 5,
    ADD COLUMN IF NOT EXISTS credits_plan_allocation INTEGER DEFAULT 5,
    ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS paystack_customer_code TEXT,
    ADD COLUMN IF NOT EXISTS billing_plan TEXT DEFAULT 'Free',
    ADD COLUMN IF NOT EXISTS profile_name TEXT,
    ADD COLUMN IF NOT EXISTS profile_email TEXT,
    ADD COLUMN IF NOT EXISTS profile_phone TEXT;

-- 5. Extend support_messages Table for AI Categorization
ALTER TABLE public.support_messages
    ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General',
    ADD COLUMN IF NOT EXISTS request_type TEXT DEFAULT 'Issue',
    ADD COLUMN IF NOT EXISTS attachment_url TEXT,
    ADD COLUMN IF NOT EXISTS ai_confidence FLOAT DEFAULT 0.0,
    ADD COLUMN IF NOT EXISTS is_ai_classified BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_support_messages_category ON public.support_messages(category);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
