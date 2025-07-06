-- Query 3: Check recent imports (last 24 hours)
SELECT 
  language,
  DATE_TRUNC('hour', created_at) as import_hour,
  COUNT(*) as words_imported
FROM system_trigger_words 
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY language, DATE_TRUNC('hour', created_at)
ORDER BY import_hour DESC, language;