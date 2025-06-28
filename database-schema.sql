-- MindDumper Database Schema
-- Run this in Supabase SQL Editor

-- Note: auth.users RLS is already enabled by Supabase

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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  language TEXT NOT NULL DEFAULT 'nl',
  total_ideas INTEGER DEFAULT 0,
  total_words INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  ideas JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_draft BOOLEAN DEFAULT false,
  session_id TEXT NULL
);

-- Create index for efficient session_id lookups
CREATE INDEX idx_brain_dumps_session_id ON public.brain_dumps(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX idx_brain_dumps_user_draft ON public.brain_dumps(user_id, is_draft) WHERE is_draft = true;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on brain_dumps
CREATE TRIGGER update_brain_dumps_updated_at
  BEFORE UPDATE ON public.brain_dumps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to cleanup old draft sessions (older than 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_drafts()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.brain_dumps 
  WHERE is_draft = true 
    AND created_at < (NOW() - INTERVAL '7 days');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- Insert trigger words for all languages
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
('nl', 'Auto', 'transport'),
('nl', 'Kleding', 'lifestyle'),
('nl', 'Eten', 'food'),
('nl', 'Muziek', 'entertainment'),
('nl', 'Boeken', 'education'),
('nl', 'Films', 'entertainment'),
('nl', 'Tuin', 'home'),
('nl', 'Huisdieren', 'personal'),

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
('en', 'Technology', 'tech'),
('en', 'Car', 'transport'),
('en', 'Clothes', 'lifestyle'),
('en', 'Food', 'food'),
('en', 'Music', 'entertainment'),
('en', 'Books', 'education'),
('en', 'Movies', 'entertainment'),
('en', 'Garden', 'home'),
('en', 'Pets', 'personal'),

-- Duitse woorden
('de', 'Arbeit', 'professional'),
('de', 'Familie', 'personal'),
('de', 'Gesundheit', 'health'),
('de', 'Haus', 'home'),
('de', 'Finanzen', 'finance'),
('de', 'Hobby', 'leisure'),
('de', 'Freunde', 'social'),
('de', 'Reisen', 'travel'),
('de', 'Studium', 'education'),
('de', 'Sport', 'fitness'),
('de', 'Kreativität', 'creative'),
('de', 'Technologie', 'tech'),

-- Franse woorden
('fr', 'Travail', 'professional'),
('fr', 'Famille', 'personal'),
('fr', 'Santé', 'health'),
('fr', 'Maison', 'home'),
('fr', 'Finance', 'finance'),
('fr', 'Loisir', 'leisure'),
('fr', 'Amis', 'social'),
('fr', 'Voyage', 'travel'),
('fr', 'Étude', 'education'),
('fr', 'Sport', 'fitness'),
('fr', 'Créativité', 'creative'),
('fr', 'Technologie', 'tech'),

-- Spaanse woorden
('es', 'Trabajo', 'professional'),
('es', 'Familia', 'personal'),
('es', 'Salud', 'health'),
('es', 'Casa', 'home'),
('es', 'Finanzas', 'finance'),
('es', 'Pasatiempo', 'leisure'),
('es', 'Amigos', 'social'),
('es', 'Viaje', 'travel'),
('es', 'Estudio', 'education'),
('es', 'Deporte', 'fitness'),
('es', 'Creatividad', 'creative'),
('es', 'Tecnología', 'tech');