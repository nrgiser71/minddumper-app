-- Database Reset: Wipe all triggerword data
-- Date: 2025-01-06
-- Purpose: Remove all mixed language data before fresh import

-- BELANGRIJK: Dit wist ALLE triggerword data maar behoudt gebruikers
-- Uitvoeren ALLEEN nadat schema migration is gedraaid

-- Step 1: Delete all user preferences and custom words (in correct order)
DELETE FROM user_custom_trigger_words;
DELETE FROM user_trigger_word_preferences; 

-- Step 2: Delete all system trigger words
DELETE FROM system_trigger_words;

-- Step 3: Delete all categories
DELETE FROM sub_categories;
DELETE FROM main_categories;

-- Step 4: Reset sequences for clean IDs
ALTER SEQUENCE main_categories_id_seq RESTART WITH 1;
ALTER SEQUENCE sub_categories_id_seq RESTART WITH 1;

-- Verification queries
SELECT 'Data wipe complete' as status;

SELECT 
  'main_categories' as table_name,
  COUNT(*) as remaining_rows
FROM main_categories
UNION ALL
SELECT 
  'sub_categories' as table_name,
  COUNT(*) as remaining_rows  
FROM sub_categories
UNION ALL
SELECT 
  'system_trigger_words' as table_name,
  COUNT(*) as remaining_rows
FROM system_trigger_words
UNION ALL
SELECT 
  'user_trigger_word_preferences' as table_name,
  COUNT(*) as remaining_rows
FROM user_trigger_word_preferences
UNION ALL
SELECT 
  'user_custom_trigger_words' as table_name,
  COUNT(*) as remaining_rows
FROM user_custom_trigger_words;

-- Check users are still intact
SELECT 
  'profiles' as table_name,
  COUNT(*) as user_count
FROM profiles;