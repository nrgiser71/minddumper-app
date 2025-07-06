-- Debug: Check current database state after reset
-- Run this in Supabase SQL Editor to see what happened

-- 1. Check system_trigger_words by language
SELECT 
  language,
  COUNT(*) as word_count,
  MIN(created_at) as earliest_word,
  MAX(created_at) as latest_word
FROM system_trigger_words 
GROUP BY language
ORDER BY language;

-- 2. Check main_categories by language
SELECT 
  language,
  COUNT(*) as category_count,
  array_agg(name ORDER BY display_order) as category_names
FROM main_categories 
GROUP BY language
ORDER BY language;

-- 3. Check sub_categories by language
SELECT 
  sc.language,
  COUNT(*) as subcategory_count,
  mc.name as main_category,
  array_agg(sc.name ORDER BY sc.display_order) as subcategory_names
FROM sub_categories sc
JOIN main_categories mc ON sc.main_category_id = mc.id
GROUP BY sc.language, mc.name
ORDER BY sc.language, mc.name;

-- 4. Check if there are any words without language field (old data)
SELECT 
  'Words with NULL language' as check_type,
  COUNT(*) as count
FROM system_trigger_words 
WHERE language IS NULL;

-- 5. Check recent imports (last 24 hours)
SELECT 
  language,
  DATE_TRUNC('hour', created_at) as import_hour,
  COUNT(*) as words_imported
FROM system_trigger_words 
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY language, DATE_TRUNC('hour', created_at)
ORDER BY import_hour DESC, language;

-- 6. Check if categories have the new language field
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'main_categories' 
  AND column_name IN ('language', 'name')
ORDER BY column_name;

-- 7. Sample words per language to verify content
SELECT 
  language,
  word,
  created_at,
  sub_category_id
FROM system_trigger_words 
WHERE language IN ('nl', 'en', 'de', 'fr', 'es')
ORDER BY language, created_at DESC
LIMIT 20;