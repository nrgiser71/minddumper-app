-- Clean Staging Database Schema
-- Extracted from production backup: db_cluster-14-08-2025@00-43-09.backup
-- Includes only essential CREATE TABLE statements without problematic elements

-- Set basic configuration
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- Drop existing tables (if they exist) in correct order to avoid foreign key issues
DROP TABLE IF EXISTS public.user_custom_trigger_words CASCADE;
DROP TABLE IF EXISTS public.brain_dumps CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.sub_categories CASCADE;
DROP TABLE IF EXISTS public.main_categories CASCADE;
DROP TABLE IF EXISTS public.trigger_words CASCADE;
DROP TABLE IF EXISTS public.system_trigger_words CASCADE;
DROP TABLE IF EXISTS public.minddump_waitlist CASCADE;

-- Create extensions (if not exists)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

--
-- Name: brain_dumps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brain_dumps (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    language text DEFAULT 'nl'::text NOT NULL,
    total_ideas integer DEFAULT 0,
    total_words integer DEFAULT 0,
    duration_minutes integer DEFAULT 0,
    ideas jsonb DEFAULT '[]'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_draft boolean DEFAULT false,
    session_id text
);

COMMENT ON COLUMN public.brain_dumps.is_draft IS 'Whether this is a draft/auto-save (true) or final save (false)';
COMMENT ON COLUMN public.brain_dumps.session_id IS 'Unique session identifier for grouping auto-saves';

--
-- Name: main_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.main_categories (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    display_order integer,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    language text DEFAULT 'nl'::text NOT NULL,
    CONSTRAINT check_main_categories_language CHECK ((language = ANY (ARRAY['nl'::text, 'en'::text, 'de'::text, 'fr'::text, 'es'::text])))
);

--
-- Name: minddump_waitlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.minddump_waitlist (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    naam character varying(255),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    ip_address inet,
    user_agent text,
    referrer text
);

COMMENT ON TABLE public.minddump_waitlist IS 'Waitlist signups for MindDump application';
COMMENT ON COLUMN public.minddump_waitlist.email IS 'Email address of the waitlist signup';
COMMENT ON COLUMN public.minddump_waitlist.naam IS 'Name of the person signing up';
COMMENT ON COLUMN public.minddump_waitlist.ip_address IS 'IP address for tracking and analytics';

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    email text,
    full_name text,
    language text DEFAULT 'nl'::text,
    payment_status text DEFAULT 'pending'::text,
    paid_at timestamp with time zone,
    amount_paid_cents integer,
    first_name text,
    last_name text,
    phone text,
    stripe_invoice_id text,
    invoice_number text,
    plugandpay_order_id text,
    login_token text,
    login_token_used boolean DEFAULT false,
    login_token_expires timestamp with time zone
);

COMMENT ON TABLE public.profiles IS 'User profiles with PlugAndPay payment integration. Stripe fields removed after migration to PlugAndPay.';
COMMENT ON COLUMN public.profiles.payment_status IS 'Payment status: pending, paid, failed, refunded';
COMMENT ON COLUMN public.profiles.paid_at IS 'Timestamp when payment was completed';
COMMENT ON COLUMN public.profiles.amount_paid_cents IS 'Amount paid in cents (EUR)';

--
-- Name: sub_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sub_categories (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    main_category_id uuid NOT NULL,
    name text NOT NULL,
    display_order integer,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    language text DEFAULT 'nl'::text NOT NULL,
    CONSTRAINT check_sub_categories_language CHECK ((language = ANY (ARRAY['nl'::text, 'en'::text, 'de'::text, 'fr'::text, 'es'::text])))
);

--
-- Name: system_trigger_words; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_trigger_words (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    word text NOT NULL,
    category text,
    language text DEFAULT 'nl'::text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT check_system_trigger_words_language CHECK ((language = ANY (ARRAY['nl'::text, 'en'::text, 'de'::text, 'fr'::text, 'es'::text])))
);

--
-- Name: trigger_words; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trigger_words (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    language text NOT NULL,
    word text NOT NULL,
    category text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT trigger_words_language_word_key UNIQUE (language, word)
);

--
-- Name: user_custom_trigger_words; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_custom_trigger_words (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    word text NOT NULL,
    category text,
    language text DEFAULT 'nl'::text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT check_user_custom_trigger_words_language CHECK ((language = ANY (ARRAY['nl'::text, 'en'::text, 'de'::text, 'fr'::text, 'es'::text])))
);

COMMENT ON TABLE public.user_custom_trigger_words IS 'Custom trigger words that users can add to their personal vocabulary';

-- Add Primary Keys
ALTER TABLE ONLY public.brain_dumps ADD CONSTRAINT brain_dumps_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.main_categories ADD CONSTRAINT main_categories_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.minddump_waitlist ADD CONSTRAINT minddump_waitlist_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.sub_categories ADD CONSTRAINT sub_categories_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.system_trigger_words ADD CONSTRAINT system_trigger_words_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.trigger_words ADD CONSTRAINT trigger_words_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_custom_trigger_words ADD CONSTRAINT user_custom_trigger_words_pkey PRIMARY KEY (id);

-- Add Foreign Key Constraints
ALTER TABLE ONLY public.brain_dumps ADD CONSTRAINT brain_dumps_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.sub_categories ADD CONSTRAINT sub_categories_main_category_id_fkey FOREIGN KEY (main_category_id) REFERENCES public.main_categories(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_custom_trigger_words ADD CONSTRAINT user_custom_trigger_words_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create Indexes
CREATE INDEX idx_brain_dumps_session_id ON public.brain_dumps USING btree (session_id) WHERE (session_id IS NOT NULL);
CREATE INDEX idx_brain_dumps_user_draft ON public.brain_dumps USING btree (user_id, is_draft) WHERE (is_draft = true);
CREATE INDEX idx_profiles_payment_status ON public.profiles USING btree (payment_status);
CREATE INDEX idx_trigger_words_language ON public.trigger_words USING btree (language);
CREATE INDEX idx_system_trigger_words_language ON public.system_trigger_words USING btree (language);

-- Enable Row Level Security
ALTER TABLE public.brain_dumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.main_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.minddump_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_trigger_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trigger_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_custom_trigger_words ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Service role can insert any profile" ON public.profiles FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role can update any profile" ON public.profiles FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role can view any profile" ON public.profiles FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies for brain_dumps
CREATE POLICY "Users can view own brain dumps" ON public.brain_dumps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own brain dumps" ON public.brain_dumps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own brain dumps" ON public.brain_dumps FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for trigger_words (public read)
CREATE POLICY "Anyone can view trigger words" ON public.trigger_words FOR SELECT USING (true);
CREATE POLICY "Anyone can view system trigger words" ON public.system_trigger_words FOR SELECT USING (true);

-- RLS Policies for user custom trigger words
CREATE POLICY "Users can view own custom trigger words" ON public.user_custom_trigger_words FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own custom trigger words" ON public.user_custom_trigger_words FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own custom trigger words" ON public.user_custom_trigger_words FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own custom trigger words" ON public.user_custom_trigger_words FOR DELETE USING (auth.uid() = user_id);

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can view categories" ON public.main_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view sub categories" ON public.sub_categories FOR SELECT USING (true);