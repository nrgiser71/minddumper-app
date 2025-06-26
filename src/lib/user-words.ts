import { supabase } from './supabase'

export interface UserTriggerWord {
  id: string
  user_id: string
  word: string
  main_category: string
  sub_category: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Initialize user trigger words table if needed
async function ensureUserWordsTable(): Promise<boolean> {
  try {
    // Test if table exists by doing a simple query
    const { error } = await supabase
      .from('user_trigger_words')
      .select('count')
      .limit(0)

    if (!error) {
      return true // Table exists
    }

    console.log('🔧 user_trigger_words table needs to be created manually')
    console.log('Please run this SQL in Supabase Dashboard > SQL Editor:')
    console.log(`
CREATE TABLE public.user_trigger_words (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  word TEXT NOT NULL,
  main_category TEXT NOT NULL,
  sub_category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, word)
);

ALTER TABLE public.user_trigger_words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trigger words" ON public.user_trigger_words
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trigger words" ON public.user_trigger_words
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trigger words" ON public.user_trigger_words
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trigger words" ON public.user_trigger_words
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_user_trigger_words_user_id ON public.user_trigger_words(user_id);
CREATE INDEX idx_user_trigger_words_active ON public.user_trigger_words(user_id, is_active);
    `)
    
    return false // Table doesn't exist
  } catch (error) {
    console.error('❌ Error checking user_trigger_words table:', error)
    return false
  }
}

// Get user's trigger words
export async function getUserTriggerWords(): Promise<UserTriggerWord[]> {
  const tableExists = await ensureUserWordsTable()
  if (!tableExists) {
    console.log('⚠️ user_trigger_words table not available, returning empty array')
    return []
  }

  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return []
    }

    const { data, error } = await supabase
      .from('user_trigger_words')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('is_active', true)
      .order('main_category', { ascending: true })
      .order('sub_category', { ascending: true })
      .order('word', { ascending: true })

    if (error) {
      console.error('❌ Error fetching user trigger words:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('❌ Error in getUserTriggerWords:', error)
    return []
  }
}

// Add new user trigger word
export async function addUserTriggerWord(word: string, mainCategory: string, subCategory: string): Promise<{ success: boolean; error?: string }> {
  const tableExists = await ensureUserWordsTable()
  if (!tableExists) {
    return { success: false, error: 'user_trigger_words table not available' }
  }

  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { error } = await supabase
      .from('user_trigger_words')
      .insert({
        user_id: user.user.id,
        word: word.trim(),
        main_category: mainCategory,
        sub_category: subCategory,
        is_active: true
      })

    if (error) {
      if (error.code === '23505') { // Duplicate key
        return { success: false, error: 'Dit woord bestaat al in je lijst' }
      }
      console.error('❌ Error adding user trigger word:', error)
      return { success: false, error: 'Database error' }
    }

    return { success: true }
  } catch (error) {
    console.error('❌ Error in addUserTriggerWord:', error)
    return { success: false, error: 'Unexpected error' }
  }
}

// Update user trigger word
export async function updateUserTriggerWord(id: string, word: string, mainCategory: string, subCategory: string): Promise<{ success: boolean; error?: string }> {
  const tableExists = await ensureUserWordsTable()
  if (!tableExists) {
    return { success: false, error: 'user_trigger_words table not available' }
  }

  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { error } = await supabase
      .from('user_trigger_words')
      .update({
        word: word.trim(),
        main_category: mainCategory,
        sub_category: subCategory,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.user.id)

    if (error) {
      console.error('❌ Error updating user trigger word:', error)
      return { success: false, error: 'Database error' }
    }

    return { success: true }
  } catch (error) {
    console.error('❌ Error in updateUserTriggerWord:', error)
    return { success: false, error: 'Unexpected error' }
  }
}

// Delete user trigger word
export async function deleteUserTriggerWord(id: string): Promise<{ success: boolean; error?: string }> {
  const tableExists = await ensureUserWordsTable()
  if (!tableExists) {
    return { success: false, error: 'user_trigger_words table not available' }
  }

  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { error } = await supabase
      .from('user_trigger_words')
      .delete()
      .eq('id', id)
      .eq('user_id', user.user.id)

    if (error) {
      console.error('❌ Error deleting user trigger word:', error)
      return { success: false, error: 'Database error' }
    }

    return { success: true }
  } catch (error) {
    console.error('❌ Error in deleteUserTriggerWord:', error)
    return { success: false, error: 'Unexpected error' }
  }
}

// Get all categories from existing trigger words to suggest to users
export async function getAvailableCategories(): Promise<{ mainCategories: string[]; subCategories: Record<string, string[]> }> {
  try {
    const { data, error } = await supabase
      .from('trigger_words')
      .select('category')
      .eq('is_active', true)

    if (error || !data) {
      // Fallback categories
      return {
        mainCategories: ['Professioneel', 'Persoonlijk'],
        subCategories: {
          'Professioneel': ['Werk', 'Projecten', 'Vergaderingen', 'Planning'],
          'Persoonlijk': ['Familie', 'Vrienden', 'Hobby', 'Gezondheid', 'Financiën']
        }
      }
    }

    const mainCategories = new Set<string>()
    const subCategories: Record<string, Set<string>> = {}

    data.forEach(item => {
      if (item.category) {
        let main: string
        let sub: string
        
        // Try different separators: '–' (em dash), '-' (hyphen), '/' (slash), '|' (pipe)
        if (item.category.includes(' – ')) {
          [main, sub] = item.category.split(' – ')
        } else if (item.category.includes(' - ')) {
          [main, sub] = item.category.split(' - ')
        } else if (item.category.includes(' / ')) {
          [main, sub] = item.category.split(' / ')
        } else if (item.category.includes('|')) {
          [main, sub] = item.category.split('|')
        } else {
          // If no separator found, treat as subcategory under "Overig"
          main = 'Overig'
          sub = item.category
        }
        
        // Clean up any remaining issues
        main = main.trim()
        sub = sub.trim()
        
        // If main contains pipe, it means parsing failed - use as subcategory under "Overig"
        if (main.includes('|')) {
          sub = main
          main = 'Overig'
        }
        
        main = main.trim()
        sub = sub.trim()
        
        mainCategories.add(main)
        
        if (!subCategories[main]) {
          subCategories[main] = new Set()
        }
        subCategories[main].add(sub)
      }
    })

    // If no structured data found, use fallback
    if (mainCategories.size === 0) {
      return {
        mainCategories: ['Professioneel', 'Persoonlijk'],
        subCategories: {
          'Professioneel': ['Werk', 'Projecten', 'Vergaderingen', 'Planning'],
          'Persoonlijk': ['Familie', 'Vrienden', 'Hobby', 'Gezondheid', 'Financiën']
        }
      }
    }

    // Convert Sets to Arrays
    const result = {
      mainCategories: Array.from(mainCategories).sort(),
      subCategories: Object.fromEntries(
        Object.entries(subCategories).map(([main, subs]) => [main, Array.from(subs).sort()])
      )
    }

    return result
  } catch (error) {
    console.error('❌ Error getting available categories:', error)
    // Fallback
    return {
      mainCategories: ['Professioneel', 'Persoonlijk'],
      subCategories: {
        'Professioneel': ['Werk', 'Projecten', 'Vergaderingen', 'Planning'],
        'Persoonlijk': ['Familie', 'Vrienden', 'Hobby', 'Gezondheid', 'Financiën']
      }
    }
  }
}