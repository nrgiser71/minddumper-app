-- Database Migration: Add language support to categories
-- Date: 2025-01-06
-- Purpose: Fix mixed language category bug by adding language field to categories

-- Step 1: Add language columns to categories tables
ALTER TABLE main_categories 
ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'nl';

ALTER TABLE sub_categories 
ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'nl';

-- Step 2: Drop existing unique constraints
ALTER TABLE main_categories 
DROP CONSTRAINT IF EXISTS main_categories_name_key;

ALTER TABLE sub_categories 
DROP CONSTRAINT IF EXISTS sub_categories_main_category_id_name_key;

-- Step 3: Add new unique constraints that include language
ALTER TABLE main_categories 
ADD CONSTRAINT main_categories_name_language_key 
UNIQUE (name, language);

ALTER TABLE sub_categories 
ADD CONSTRAINT sub_categories_main_category_id_name_language_key 
UNIQUE (main_category_id, name, language);

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_main_categories_language 
ON main_categories(language, display_order);

CREATE INDEX IF NOT EXISTS idx_sub_categories_language 
ON sub_categories(language, display_order);

-- Step 5: Add check constraint to ensure valid language codes
ALTER TABLE main_categories 
ADD CONSTRAINT check_main_categories_language 
CHECK (language IN ('nl', 'en', 'de', 'fr', 'es'));

ALTER TABLE sub_categories 
ADD CONSTRAINT check_sub_categories_language 
CHECK (language IN ('nl', 'en', 'de', 'fr', 'es'));

-- Note: After running this migration, you need to:
-- 1. Delete all existing data (categories and trigger words)
-- 2. Re-import data with proper language fields
-- 3. Update all queries to filter by language