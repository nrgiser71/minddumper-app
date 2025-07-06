-- Complete database wipe: Remove ALL triggerword data
-- Voer uit in Supabase SQL Editor

-- Step 1: Delete all user data (in correct order for foreign keys)
DELETE FROM user_custom_trigger_words;
DELETE FROM user_trigger_word_preferences;

-- Step 2: Delete all system trigger words
DELETE FROM system_trigger_words;

-- Step 3: Delete all categories
DELETE FROM sub_categories;
DELETE FROM main_categories;

-- Step 4: Reset sequences (find correct names first)
-- Check what sequences exist:
SELECT schemaname, sequencename 
FROM pg_sequences 
WHERE sequencename LIKE '%categories%';

-- Reset sequences (use correct names from above)
-- ALTER SEQUENCE main_categories_id_seq RESTART WITH 1;
-- ALTER SEQUENCE sub_categories_id_seq RESTART WITH 1;

-- Verification: Check everything is empty
SELECT 'main_categories' as table_name, COUNT(*) as rows FROM main_categories
UNION ALL
SELECT 'sub_categories' as table_name, COUNT(*) as rows FROM sub_categories
UNION ALL
SELECT 'system_trigger_words' as table_name, COUNT(*) as rows FROM system_trigger_words
UNION ALL
SELECT 'user_trigger_word_preferences' as table_name, COUNT(*) as rows FROM user_trigger_word_preferences
UNION ALL
SELECT 'user_custom_trigger_words' as table_name, COUNT(*) as rows FROM user_custom_trigger_words;