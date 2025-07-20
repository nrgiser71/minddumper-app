import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminSessionFromRequest } from '@/lib/admin-auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {
  if (!verifyAdminSessionFromRequest(request)) {
    return NextResponse.json({ 
      success: false, 
      error: 'Unauthorized access' 
    }, { status: 401 })
  }

  try {
    // Creating backup of all trigger words

    // Get all trigger words with full structure
    const { data: words, error } = await supabase
      .from('trigger_words')
      .select('*')
      .eq('language', 'nl')
      .order('category')
      .order('word')

    if (error) {
      throw error
    }

    // Organize by main category and subcategory
    const structure: Record<string, Record<string, string[]>> = {}
    
    for (const word of words || []) {
      let mainCat = 'Persoonlijk'
      let subCat = word.category || 'Algemeen'
      
      if (word.category && word.category.includes('|')) {
        const [main, sub] = word.category.split('|')
        mainCat = main
        subCat = sub
      }
      
      if (!structure[mainCat]) {
        structure[mainCat] = {}
      }
      if (!structure[mainCat][subCat]) {
        structure[mainCat][subCat] = []
      }
      
      structure[mainCat][subCat].push(word.word)
    }

    // Create backup object
    const backup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      language: 'nl',
      totalWords: words?.length || 0,
      structure: structure,
      rawData: words // Include raw data for complete restore
    }

    // Return as downloadable JSON file
    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="minddumper-backup-${new Date().toISOString().split('T')[0]}.json"`
      }
    })

  } catch (error) {
    // Error creating backup
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}