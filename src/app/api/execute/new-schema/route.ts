import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ 
    message: 'Manual SQL execution required',
    sql: `-- Create new normalized database schema for MindDumper
-- This creates NEW tables alongside the existing trigger_words table

-- 1. Main Categories Table
CREATE TABLE IF NOT EXISTS public.main_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Sub Categories Table  
CREATE TABLE IF NOT EXISTS public.sub_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  main_category_id UUID REFERENCES main_categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  display_order INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(main_category_id, name)
);

-- 3. System Trigger Words Table
CREATE TABLE IF NOT EXISTS public.system_trigger_words (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sub_category_id UUID REFERENCES sub_categories(id) ON DELETE CASCADE NOT NULL,
  word TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'nl',
  display_order INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. User Trigger Word Preferences Table
CREATE TABLE IF NOT EXISTS public.user_trigger_word_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  system_word_id UUID REFERENCES system_trigger_words(id) ON DELETE CASCADE NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, system_word_id)
);

-- 5. User Custom Trigger Words Table
CREATE TABLE IF NOT EXISTS public.user_custom_trigger_words (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sub_category_id UUID REFERENCES sub_categories(id) ON DELETE CASCADE NOT NULL,
  word TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, word)
);

-- Enable Row Level Security on all new tables
ALTER TABLE public.main_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_trigger_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_trigger_word_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_custom_trigger_words ENABLE ROW LEVEL SECURITY;

-- RLS Policies for main_categories (read-only for all authenticated users)
CREATE POLICY "Anyone can view main categories" ON public.main_categories
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for sub_categories (read-only for all authenticated users)
CREATE POLICY "Anyone can view sub categories" ON public.sub_categories
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for system_trigger_words (read-only for all authenticated users)
CREATE POLICY "Anyone can view system trigger words" ON public.system_trigger_words
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for user_trigger_word_preferences (user-specific)
CREATE POLICY "Users can view own preferences" ON public.user_trigger_word_preferences
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_trigger_word_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_trigger_word_preferences
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own preferences" ON public.user_trigger_word_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_custom_trigger_words (user-specific)
CREATE POLICY "Users can view own custom words" ON public.user_custom_trigger_words
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own custom words" ON public.user_custom_trigger_words
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own custom words" ON public.user_custom_trigger_words
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own custom words" ON public.user_custom_trigger_words
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_main_categories_active ON public.main_categories(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_sub_categories_main_id ON public.sub_categories(main_category_id, is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_system_words_sub_id ON public.system_trigger_words(sub_category_id, language, is_active);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_trigger_word_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_custom_words_user_id ON public.user_custom_trigger_words(user_id, is_active);

-- Insert default main categories
INSERT INTO public.main_categories (name, display_order) VALUES 
  ('Professioneel', 1),
  ('Persoonlijk', 2)
ON CONFLICT (name) DO NOTHING;

-- Insert default sub categories for Professioneel
INSERT INTO public.sub_categories (main_category_id, name, display_order) 
SELECT mc.id, subcats.name, subcats.display_order
FROM public.main_categories mc,
(VALUES 
  ('Werk', 1),
  ('Projecten', 2),
  ('Vergaderingen', 3),
  ('Planning', 4),
  ('Marketing', 5),
  ('Verkoop', 6),
  ('Administratie', 7)
) AS subcats(name, display_order)
WHERE mc.name = 'Professioneel'
ON CONFLICT (main_category_id, name) DO NOTHING;

-- Insert default sub categories for Persoonlijk
INSERT INTO public.sub_categories (main_category_id, name, display_order) 
SELECT mc.id, subcats.name, subcats.display_order
FROM public.main_categories mc,
(VALUES 
  ('Familie', 1),
  ('Vrienden', 2),
  ('Hobby', 3),
  ('Gezondheid', 4),
  ('Financiën', 5),
  ('Huishouden', 6),
  ('Ontspanning', 7)
) AS subcats(name, display_order)
WHERE mc.name = 'Persoonlijk'
ON CONFLICT (main_category_id, name) DO NOTHING;

SELECT 'New normalized database schema created successfully!' as result;`,
    instructions: [
      '1. Go to your Supabase Dashboard',
      '2. Navigate to SQL Editor', 
      '3. Copy and paste the SQL above',
      '4. Click Run to execute',
      '5. The new normalized tables will be created'
    ]
  })
}