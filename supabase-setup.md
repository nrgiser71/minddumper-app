# Supabase Setup Guide voor MindDumper

## Stap 1: Account Aanmaken

1. **Ga naar:** https://supabase.com
2. **Klik:** "Start your project"
3. **Sign up** met GitHub account (aanbevolen) of email
4. **Verify** je email adres

## Stap 2: Nieuw Project Aanmaken

1. **Klik:** "New Project"
2. **Vul in:**
   - Organization: Kies je persoonlijke org
   - Name: `minddumper`
   - Database Password: Genereer een sterk wachtwoord (BEWAAR DIT!)
   - Region: `West Europe (eu-west-1)` (dichtst bij Nederland)
   - Pricing Plan: `Free`
3. **Klik:** "Create new project"
4. **Wacht:** 2-3 minuten voor database setup

## Stap 3: Database Schema SQL Script

Zodra je project klaar is, ga naar **SQL Editor** en run dit script:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT,
  full_name TEXT,
  language TEXT DEFAULT 'nl'
);

-- Create brain_dumps table
CREATE TABLE public.brain_dumps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  language TEXT NOT NULL DEFAULT 'nl',
  total_ideas INTEGER DEFAULT 0,
  total_words INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  ideas JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create trigger_words table
CREATE TABLE public.trigger_words (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  language TEXT NOT NULL,
  word TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(language, word)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brain_dumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trigger_words ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for brain_dumps
CREATE POLICY "Users can view own brain dumps" ON public.brain_dumps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brain dumps" ON public.brain_dumps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brain dumps" ON public.brain_dumps
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brain dumps" ON public.brain_dumps
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for trigger_words (read-only for users)
CREATE POLICY "Anyone can view active trigger words" ON public.trigger_words
  FOR SELECT USING (is_active = true);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert some trigger words for testing
INSERT INTO public.trigger_words (language, word, category) VALUES
-- Nederlandse woorden
('nl', 'Werk', 'professional'),
('nl', 'Familie', 'personal'),
('nl', 'Gezondheid', 'health'),
('nl', 'Huis', 'home'),
('nl', 'Financiën', 'finance'),
('nl', 'Hobby', 'leisure'),
('nl', 'Vrienden', 'social'),
('nl', 'Reizen', 'travel'),
('nl', 'Studie', 'education'),
('nl', 'Sport', 'fitness'),
('nl', 'Creativiteit', 'creative'),
('nl', 'Technologie', 'tech'),

-- Engelse woorden
('en', 'Work', 'professional'),
('en', 'Family', 'personal'),
('en', 'Health', 'health'),
('en', 'Home', 'home'),
('en', 'Finance', 'finance'),
('en', 'Hobby', 'leisure'),
('en', 'Friends', 'social'),
('en', 'Travel', 'travel'),
('en', 'Study', 'education'),
('en', 'Sports', 'fitness'),
('en', 'Creativity', 'creative'),
('en', 'Technology', 'tech');
```

## Stap 4: API Keys Ophalen

1. **Ga naar:** Project Settings → API
2. **Kopieer deze waarden:**
   - Project URL (iets zoals: `https://abc123.supabase.co`)
   - `anon` `public` key (lange string)
   - `service_role` `secret` key (voor later)

## Stap 5: Environment Variables

Je krijgt deze waarden die we in Vercel moeten zetten:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

**Volgende stap:** Zodra je dit hebt gedaan, gaan we de Supabase client in Next.js integreren!