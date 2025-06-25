import { supabase, type BrainDump } from './supabase'

// Fetch trigger words for a specific language
export async function getTriggerWords(language: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('trigger_words')
      .select('word')
      .eq('language', language)
      .eq('is_active', true)
      .order('word')

    if (error) {
      console.error('Error fetching trigger words:', error)
      // Fallback to mock data
      return getMockTriggerWords(language)
    }

    return data?.map(item => item.word) || getMockTriggerWords(language)
  } catch (error) {
    console.error('Error:', error)
    return getMockTriggerWords(language)
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