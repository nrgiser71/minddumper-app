// Script to run the auto-save migration programmatically
// Run with: npx ts-node src/scripts/run-migration.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key needed for schema changes

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  console.log('🚀 Starting auto-save migration...')
  
  try {
    // Add columns if they don't exist
    console.log('📝 Adding new columns...')
    await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.brain_dumps 
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS session_id TEXT NULL;
      `
    })

    // Create indexes
    console.log('🔍 Creating indexes...')
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_brain_dumps_session_id ON public.brain_dumps(session_id) WHERE session_id IS NOT NULL;
        CREATE INDEX IF NOT EXISTS idx_brain_dumps_user_draft ON public.brain_dumps(user_id, is_draft) WHERE is_draft = true;
      `
    })

    // Create functions and triggers
    console.log('⚙️ Setting up triggers...')
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = timezone('utc'::text, now());
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS update_brain_dumps_updated_at ON public.brain_dumps;
        CREATE TRIGGER update_brain_dumps_updated_at
          BEFORE UPDATE ON public.brain_dumps
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `
    })

    // Create cleanup function
    console.log('🧹 Setting up cleanup function...')
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION cleanup_old_drafts()
        RETURNS INTEGER AS $$
        DECLARE
          deleted_count INTEGER;
        BEGIN
          DELETE FROM public.brain_dumps 
          WHERE is_draft = true 
            AND created_at < (NOW() - INTERVAL '7 days');
          
          GET DIAGNOSTICS deleted_count = ROW_COUNT;
          RETURN deleted_count;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    })

    // Update existing records
    console.log('🔄 Updating existing records...')
    await supabase.rpc('exec_sql', {
      sql: `
        UPDATE public.brain_dumps 
        SET updated_at = created_at 
        WHERE updated_at IS NULL;
      `
    })

    console.log('✅ Migration completed successfully!')
    
    // Verify migration
    const { error } = await supabase
      .from('brain_dumps')
      .select('id, is_draft, session_id, updated_at')
      .limit(1)
    
    if (error) {
      console.error('❌ Migration verification failed:', error)
    } else {
      console.log('✓ Migration verified - new columns are accessible')
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  runMigration()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { runMigration }