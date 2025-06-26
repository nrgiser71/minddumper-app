import { supabase, type BrainDump, type TriggerWord } from './supabase'
import { getUserTriggerWords } from './user-words'

// Fetch trigger words for a specific language with hierarchical structure
export async function getTriggerWords(language: string): Promise<TriggerWord[]> {
  try {
    console.log(`🔍 Fetching structured trigger words for language: ${language}`)
    
    const { data, error } = await supabase
      .from('trigger_words')
      .select('*')
      .eq('language', language)
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('id', { ascending: true })

    if (error) {
      console.error('❌ Database error in getTriggerWords:', error)
      return getMockTriggerWordsStructured(language)
    }

    console.log(`✅ Found ${data?.length || 0} structured trigger words`)
    
    if (!data || data.length === 0) {
      console.log('⚠️ No structured words found, using fallback')
      return getMockTriggerWordsStructured(language)
    }
    
    // Sort to ensure proper order: Professional first, then by category
    const sorted = data.sort((a, b) => {
      const aMain = a.category?.includes('Professioneel') ? 0 : 1
      const bMain = b.category?.includes('Professioneel') ? 0 : 1
      
      if (aMain !== bMain) return aMain - bMain
      
      // Then sort by category
      return (a.category || '').localeCompare(b.category || '')
    })
    
    return sorted
  } catch (error) {
    console.error('❌ Error in getTriggerWords:', error)
    return getMockTriggerWordsStructured(language)
  }
}

// Legacy function for simple word lists (for backward compatibility)
export async function getTriggerWordsList(language: string): Promise<string[]> {
  try {
    console.log(`🔍 Fetching trigger words for language: ${language}`)
    
    // Get both standard trigger words and user trigger words
    const [standardWordsResult, userWords] = await Promise.all([
      supabase
        .from('trigger_words')
        .select('word, category')
        .eq('language', language)
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('id', { ascending: true }),
      getUserTriggerWords()
    ])

    const { data, error } = standardWordsResult

    if (error) {
      console.error('❌ Database error:', error)
      return ['Werk', 'Familie'] // Fallback
    }

    let standardWords: string[] = []
    if (data && data.length > 0) {
      // Sort to ensure Professional comes before Personal
      const sorted = data.sort((a, b) => {
        const aMain = a.category?.includes('Professioneel') ? 0 : 1
        const bMain = b.category?.includes('Professioneel') ? 0 : 1
        
        if (aMain !== bMain) return aMain - bMain
        
        // Then sort by category and maintain order
        return 0
      })
      
      standardWords = sorted.map(row => row.word)
    }

    // Add user words to the list (they'll appear after standard words)
    const userWordsList = userWords
      .filter(word => word.is_active)
      .map(word => word.word)

    const allWords = [...standardWords, ...userWordsList]
    
    console.log(`✅ Found ${standardWords.length} standard + ${userWordsList.length} user trigger words = ${allWords.length} total`)
    
    if (allWords.length === 0) {
      console.log('⚠️ No words found, using fallback')
      return ['Werk', 'Familie']
    }
    
    return allWords
  } catch (error) {
    console.error('❌ Error in getTriggerWordsList:', error)
    return ['Werk', 'Familie'] // Fallback
  }
}

// Save brain dump to database
export async function saveBrainDump(brainDump: {
  language: string
  ideas: string[]
  total_words: number
  duration_minutes: number
}): Promise<string | null> {
  try {
    const { data: user } = await supabase.auth.getUser()
    
    if (!user.user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('brain_dumps')
      .insert({
        user_id: user.user.id,
        language: brainDump.language,
        ideas: brainDump.ideas,
        total_ideas: brainDump.ideas.length,
        total_words: brainDump.total_words,
        duration_minutes: brainDump.duration_minutes,
        metadata: {
          created_via: 'web_app',
          version: '1.0'
        }
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error saving brain dump:', error)
      return null
    }

    return data?.id || null
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// Get user's brain dump history
export async function getBrainDumpHistory(): Promise<BrainDump[]> {
  try {
    const { data: user } = await supabase.auth.getUser()
    
    if (!user.user) {
      return []
    }

    const { data, error } = await supabase
      .from('brain_dumps')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching brain dump history:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

// Mock data fallback for when database is unavailable
function getMockTriggerWordsStructured(language: string): TriggerWord[] {
  const mockWords = [
    {
      id: '1',
      language,
      word: 'Werk',
      main_category: 'Professioneel',
      sub_category: 'Algemeen',
      main_category_order: 1,
      sub_category_order: 1,
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '2', 
      language,
      word: 'Familie',
      main_category: 'Persoonlijk',
      sub_category: 'Relaties',
      main_category_order: 2,
      sub_category_order: 1,
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ]
  
  return mockWords
}

