-- Query 1: Check system_trigger_words by language
SELECT 
  language,
  COUNT(*) as word_count,
  MIN(created_at) as earliest_word,
  MAX(created_at) as latest_word
FROM system_trigger_words 
GROUP BY language
ORDER BY language;