-- Debug: Check user preferences per language
-- Run this to see if preferences exist for all languages

-- 1. Count preferences per language
SELECT 
  stw.language,
  COUNT(utp.id) as preferences_saved,
  COUNT(stw.id) as total_words_in_language,
  ROUND(COUNT(utp.id) * 100.0 / COUNT(stw.id), 1) as percentage_with_preferences
FROM system_trigger_words stw
LEFT JOIN user_trigger_word_preferences utp ON stw.id = utp.system_word_id
GROUP BY stw.language
ORDER BY stw.language;

-- 2. Check enabled vs disabled per language
SELECT 
  stw.language,
  utp.is_enabled,
  COUNT(*) as count
FROM system_trigger_words stw
JOIN user_trigger_word_preferences utp ON stw.id = utp.system_word_id
GROUP BY stw.language, utp.is_enabled
ORDER BY stw.language, utp.is_enabled;

-- 3. Show sample words without preferences (these will default to enabled)
SELECT 
  stw.language,
  stw.word,
  stw.id as word_id,
  CASE WHEN utp.id IS NULL THEN 'NO PREFERENCE (defaults to enabled)' 
       ELSE CONCAT('PREFERENCE: ', utp.is_enabled) END as status
FROM system_trigger_words stw
LEFT JOIN user_trigger_word_preferences utp ON stw.id = utp.system_word_id
WHERE utp.id IS NULL
ORDER BY stw.language, stw.word
LIMIT 20;