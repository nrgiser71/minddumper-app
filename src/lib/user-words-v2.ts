import { supabase } from './supabase'

export interface UserCustomWord {
  id: string
  user_id: string
  word: string
  sub_category_id: string
  sub_category?: {
    id: string
    name: string
    main_category: {
      id: string
      name: string
    }
  }
  is_active: boolean
  created_at: string
  updated_at: string
}

// Get user's custom trigger words for a specific language
export async function getUserCustomWords(language: string = 'nl'): Promise<UserCustomWord[]> {
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return []
    }

    const { data, error } = await supabase
      .from('user_custom_trigger_words')
      .select(`
        *,
        sub_category:sub_categories!inner(
          id,
          name,
          main_category:main_categories!inner(
            id,
            name
          )
        )
      `)
      .eq('user_id', user.user.id)
      .eq('language', language)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      // Error fetching user custom words
      return []
    }

    return data || []
  } catch {
    // Error in getUserCustomWords
    return []
  }
}

// Add new user custom word
export async function addUserCustomWord(word: string, subCategoryId: string, language: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { error } = await supabase
      .from('user_custom_trigger_words')
      .insert({
        user_id: user.user.id,
        word: word.trim(),
        sub_category_id: subCategoryId,
        language: language,
        is_active: true
      })

    if (error) {
      if (error.code === '23505') { // Duplicate key
        return { success: false, error: 'Dit woord bestaat al in je lijst' }
      }
      // Error adding user word
      return { success: false, error: 'Database error' }
    }

    return { success: true }
  } catch {
    // Error in addUserCustomWord
    return { success: false, error: 'Unexpected error' }
  }
}

// Update user custom word
export async function updateUserCustomWord(id: string, word: string, subCategoryId: string, language: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { error } = await supabase
      .from('user_custom_trigger_words')
      .update({
        word: word.trim(),
        sub_category_id: subCategoryId,
        language: language,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.user.id)

    if (error) {
      // Error updating user word
      return { success: false, error: 'Database error' }
    }

    return { success: true }
  } catch {
    // Error in updateUserCustomWord
    return { success: false, error: 'Unexpected error' }
  }
}

// Delete user custom word
export async function deleteUserCustomWord(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { error } = await supabase
      .from('user_custom_trigger_words')
      .delete()
      .eq('id', id)
      .eq('user_id', user.user.id)

    if (error) {
      // Error deleting user word
      return { success: false, error: 'Database error' }
    }

    return { success: true }
  } catch {
    // Error in deleteUserCustomWord
    return { success: false, error: 'Unexpected error' }
  }
}