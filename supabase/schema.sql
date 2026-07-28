-- ReFlow Database Schema for Supabase

-- 1. Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    niche VARCHAR(50) DEFAULT 'Tech & Lifestyle',
    whatsapp_number VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Social Stats table (stores connected social network metrics)
CREATE TABLE IF NOT EXISTS public.social_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    platform VARCHAR(30) NOT NULL, -- 'instagram', 'tiktok', 'youtube', 'twitch'
    handle VARCHAR(50) NOT NULL,
    followers BIGINT DEFAULT 0,
    engagement_rate NUMERIC(5,2) DEFAULT 0.00,
    avg_reach BIGINT DEFAULT 0,
    connected BOOLEAN DEFAULT FALSE,
    last_synced TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(user_id, platform)
);

-- 3. Pricing Packages table
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    delivery_days INT DEFAULT 3,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Quotes / Leads table (when brands request quotes)
CREATE TABLE IF NOT EXISTS public.quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    brand_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100) NOT NULL,
    selected_packages JSONB,
    total_amount NUMERIC(10,2),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'contacted', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Social stats are viewable by everyone." ON public.social_stats FOR SELECT USING (true);
CREATE POLICY "Users can manage own social stats." ON public.social_stats FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Packages are viewable by everyone." ON public.packages FOR SELECT USING (true);
CREATE POLICY "Users can manage own packages." ON public.packages FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create a quote." ON public.quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Creators can view their quotes." ON public.quotes FOR SELECT USING (auth.uid() = creator_id);
