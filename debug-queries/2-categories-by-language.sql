-- Query 2: Check main_categories by language
SELECT 
  language,
  COUNT(*) as category_count,
  array_agg(name ORDER BY display_order) as category_names
FROM main_categories 
GROUP BY language
ORDER BY language;