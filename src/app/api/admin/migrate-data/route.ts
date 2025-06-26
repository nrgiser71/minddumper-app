import { NextResponse } from 'next/server'

export async function GET() {
  const sql = `-- Migrate data from old trigger_words table to new normalized structure
-- This script analyzes existing data and migrates it properly

-- First, let's see what we have in the old table
SELECT 'Current trigger_words data:' as step;
SELECT category, COUNT(*) as word_count 
FROM trigger_words 
WHERE is_active = true 
GROUP BY category 
ORDER BY category;

-- Step 1: Migrate categories that follow the pattern "MainCategory – SubCategory"
INSERT INTO system_trigger_words (sub_category_id, word, language, is_active)
SELECT 
  sc.id as sub_category_id,
  tw.word,
  tw.language,
  tw.is_active
FROM trigger_words tw
JOIN (
  -- Parse categories with " – " separator
  SELECT 
    category,
    TRIM(SPLIT_PART(category, ' – ', 1)) as main_cat,
    TRIM(SPLIT_PART(category, ' – ', 2)) as sub_cat
  FROM trigger_words
  WHERE category LIKE '% – %'
    AND is_active = true
) parsed ON tw.category = parsed.category
JOIN main_categories mc ON mc.name = parsed.main_cat
JOIN sub_categories sc ON sc.main_category_id = mc.id AND sc.name = parsed.sub_cat
WHERE tw.is_active = true;

-- Step 2: Handle categories that don't fit the standard pattern
-- These will go under "Overig" subcategories

-- Create "Overig" subcategory for each main category if it doesn't exist
INSERT INTO sub_categories (main_category_id, name, display_order)
SELECT mc.id, 'Overig', 999
FROM main_categories mc
WHERE NOT EXISTS (
  SELECT 1 FROM sub_categories sc 
  WHERE sc.main_category_id = mc.id AND sc.name = 'Overig'
);

-- Migrate words with non-standard categories to "Overig"
INSERT INTO system_trigger_words (sub_category_id, word, language, is_active)
SELECT 
  sc.id as sub_category_id,
  tw.word,
  tw.language,
  tw.is_active
FROM trigger_words tw
JOIN main_categories mc ON mc.name = 'Professioneel' -- Default to Professioneel for now
JOIN sub_categories sc ON sc.main_category_id = mc.id AND sc.name = 'Overig'
WHERE tw.is_active = true
  AND tw.category NOT LIKE '% – %'  -- Categories that don't follow standard pattern
  AND NOT EXISTS (
    SELECT 1 FROM system_trigger_words stw WHERE stw.word = tw.word
  );

-- Step 3: Show migration results
SELECT 'Migration completed!' as result;
SELECT 'New system_trigger_words count:' as info, COUNT(*) as count FROM system_trigger_words;
SELECT 'Breakdown by category:' as breakdown;
SELECT 
  mc.name as main_category,
  sc.name as sub_category,
  COUNT(stw.id) as word_count
FROM main_categories mc
JOIN sub_categories sc ON sc.main_category_id = mc.id
LEFT JOIN system_trigger_words stw ON stw.sub_category_id = sc.id
GROUP BY mc.name, sc.name, mc.display_order, sc.display_order
ORDER BY mc.display_order, sc.display_order;`

  return NextResponse.json({ 
    sql,
    instruction: 'Copy this SQL and run it in Supabase Dashboard > SQL Editor',
    steps: [
      '1. This will analyze your existing trigger_words data',
      '2. Migrate words that follow "MainCategory – SubCategory" pattern', 
      '3. Put non-standard categories under "Overig" subcategories',
      '4. Show you the results of the migration',
      '5. Your original trigger_words table remains untouched'
    ],
    note: 'Review the results before proceeding with API updates'
  })
}

export async function POST() {
  return GET()
}