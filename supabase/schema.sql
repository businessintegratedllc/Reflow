-- ReFlow Database Schema for Supabase (Updated for seamless cross-device sync)

CREATE TABLE IF NOT EXISTS public.profiles (
    id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    niche VARCHAR(50) DEFAULT 'Tecnología & Lifestyle',
    whatsapp_number VARCHAR(30),
    plan VARCHAR(30) DEFAULT 'Free',
    subscription_status VARCHAR(20) DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.social_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(100) REFERENCES public.profiles(id) ON DELETE CASCADE,
    platform VARCHAR(30) NOT NULL,
    handle VARCHAR(50) NOT NULL,
    followers BIGINT DEFAULT 0,
    engagement_rate NUMERIC(5,2) DEFAULT 0.00,
    avg_reach BIGINT DEFAULT 0,
    connected BOOLEAN DEFAULT FALSE,
    last_synced TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(user_id, platform)
);

CREATE TABLE IF NOT EXISTS public.packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(100) REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    delivery_days INT DEFAULT 3,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id VARCHAR(100) REFERENCES public.profiles(id) ON DELETE CASCADE,
    creator_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    plan VARCHAR(50) DEFAULT 'Pro Mensual',
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    paypal_order_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Row Level Security (RLS) & Open Public Access for seamless cross-device creator onboarding
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow public read/write so creators can sync across phone and computer instantly without strict auth walls
CREATE POLICY "Allow public access to profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to social_stats" ON public.social_stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to packages" ON public.packages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to subscriptions" ON public.subscriptions FOR ALL USING (true) WITH CHECK (true);
