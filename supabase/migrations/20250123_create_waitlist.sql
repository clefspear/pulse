-- Waitlist table for Pulse landing page signups
CREATE TABLE IF NOT EXISTS public.waitlist (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text UNIQUE NOT NULL,
    tier text DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
    status text DEFAULT 'active' CHECK (status IN ('active', 'pending_payment', 'paid', 'cancelled')),
    waitlist_number serial,
    stripe_checkout_session_id text,
    stripe_customer_id text,
    referral_code text UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
    referred_by text REFERENCES public.waitlist(referral_code),
    ip_address text,
    user_agent text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS waitlist_tier_idx ON public.waitlist(tier);
CREATE INDEX IF NOT EXISTS waitlist_status_idx ON public.waitlist(status);
CREATE INDEX IF NOT EXISTS waitlist_created_at_idx ON public.waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS waitlist_referral_code_idx ON public.waitlist(referral_code);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_waitlist_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS waitlist_updated_at_trigger ON public.waitlist;
CREATE TRIGGER waitlist_updated_at_trigger
    BEFORE UPDATE ON public.waitlist
    FOR EACH ROW
    EXECUTE FUNCTION update_waitlist_updated_at();

-- Waitlist stats view for admin dashboard
CREATE OR REPLACE VIEW waitlist_stats AS
SELECT 
    COUNT(*) as total_signups,
    COUNT(*) FILTER (WHERE tier = 'free') as free_signups,
    COUNT(*) FILTER (WHERE tier = 'pro') as pro_signups,
    COUNT(*) FILTER (WHERE status = 'paid') as paid_users,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as signups_last_24h,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as signups_last_7d
FROM public.waitlist;
