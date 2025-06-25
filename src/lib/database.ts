import { supabase, type BrainDump, type TriggerWord } from './supabase'

// Fetch trigger words for a specific language with hierarchical structure
export async function getTriggerWords(language: string): Promise<TriggerWord[]> {
  try {
    const { data, error } = await supabase
      .from('trigger_words')
      .select('*')
      .eq('language', language)
      .eq('is_active', true)
      .order('main_category_order', { ascending: true })
      .order('sub_category_order', { ascending: true })
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching trigger words:', error)
      // Fallback to mock data
      return getMockTriggerWordsStructured(language)
    }

    return data || getMockTriggerWordsStructured(language)
  } catch (error) {
    console.error('Error:', error)
    return getMockTriggerWordsStructured(language)
  }
}

// Legacy function for simple word lists (for backward compatibility)
export async function getTriggerWordsList(language: string): Promise<string[]> {
  const words = await getTriggerWords(language)
  return words.map(w => w.word)
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

// Legacy mock function for backward compatibility
function getMockTriggerWords(language: string): string[] {
  const mockWords = {
    nl: ['Werk', 'Familie', 'Gezondheid', 'Huis', 'Financiën', 'Hobby', 'Vrienden', 'Reizen', 'Studie', 'Sport', 'Creativiteit', 'Technologie'],
    en: ['Work', 'Family', 'Health', 'Home', 'Finance', 'Hobby', 'Friends', 'Travel', 'Study', 'Sports', 'Creativity', 'Technology'],
    de: ['Arbeit', 'Familie', 'Gesundheit', 'Haus', 'Finanzen', 'Hobby', 'Freunde', 'Reisen', 'Studium', 'Sport', 'Kreativität', 'Technologie'],
    fr: ['Travail', 'Famille', 'Santé', 'Maison', 'Finance', 'Loisir', 'Amis', 'Voyage', 'Étude', 'Sport', 'Créativité', 'Technologie'],
    es: ['Trabajo', 'Familia', 'Salud', 'Casa', 'Finanzas', 'Pasatiempo', 'Amigos', 'Viaje', 'Estudio', 'Deporte', 'Creatividad', 'Tecnología']
  }
  
  return mockWords[language as keyof typeof mockWords] || mockWords.en
}