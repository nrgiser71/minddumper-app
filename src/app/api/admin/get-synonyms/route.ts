import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, type, language } = await request.json()

    if (!text || !type || !language) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Try AI-powered synonyms first
    let synonyms = await getAISynonyms(text, type, language)
    
    // Fallback to hardcoded if AI fails
    if (!synonyms || synonyms.length === 0) {
      synonyms = generateSynonyms(text, type, language)
    }

    return NextResponse.json({
      success: true,
      synonyms: synonyms.slice(0, 8) // Limit to 8 suggestions
    })

  } catch (error) {
    console.error('Error generating synonyms:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate synonyms' 
    }, { status: 500 })
  }
}

async function getAISynonyms(text: string, type: string, language: string): Promise<string[]> {
  try {
    const languageNames = {
      'nl': 'Dutch',
      'en': 'English', 
      'de': 'German',
      'fr': 'French',
      'es': 'Spanish'
    }
    
    const prompt = `Generate 6-8 synonyms for the ${languageNames[language as keyof typeof languageNames]} word "${text}" in the context of productivity and task management (GTD method). 

Context: This is a ${type === 'word' ? 'trigger word' : 'category name'} used for brain dumping tasks and ideas.

Requirements:
- Return only ${languageNames[language as keyof typeof languageNames]} synonyms
- Keep the same meaning and context
- Suitable for professional/business use
- No explanations, just the synonyms
- One synonym per line
- Max 8 synonyms

Example format:
synoniem1
synoniem2
synoniem3`

    // Using Anthropic Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    })

    if (response.ok) {
      const data = await response.json()
      const content = data.content?.[0]?.text || ''
      const synonyms = content
        .split('\n')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0 && s.toLowerCase() !== text.toLowerCase())
      
      console.log(`🤖 AI generated ${synonyms.length} synonyms for "${text}":`, synonyms)
      return synonyms
    }
  } catch (error) {
    console.log(`⚠️ AI synonym generation failed for "${text}":`, error)
  }
  
  return []
}

function generateSynonyms(text: string, type: string, language: string): string[] {
  const synonyms: string[] = []
  
  // Dutch synonyms
  if (language === 'nl') {
    const dutchSynonyms: Record<string, string[]> = {
      // Common trigger words
      'taken': ['opdrachten', 'activiteiten', 'werkzaamheden', 'jobs', 'todo\'s'],
      'projecten': ['initiatieven', 'ondernemingen', 'plannen', 'ventures', 'programma\'s'],
      'ideeën': ['concepten', 'gedachten', 'inspiratie', 'inzichten', 'brainwaves'],
      'planning': ['schema', 'agenda', 'tijdsindeling', 'roostering', 'organisatie'],
      'afspraken': ['meetings', 'bijeenkomsten', 'gesprekken', 'sessies', 'overleg'],
      
      // Categories
      'professioneel': ['zakelijk', 'werk-gerelateerd', 'carrière', 'business', 'professionele'],
      'persoonlijk': ['privé', 'individueel', 'eigen', 'particulier', 'persoonlijke'],
      'administratie': ['beheer', 'management', 'organisatie', 'registratie', 'administratief'],
      'communicatie': ['contact', 'correspondentie', 'interactie', 'uitwisseling', 'verbinding'],
      'financiën': ['geld', 'budget', 'economie', 'financieel', 'geldzaken'],
      'gezondheid': ['welzijn', 'fitness', 'zorg', 'medisch', 'lichamelijk'],
      'familie': ['familieleven', 'huishouden', 'thuis', 'verwanten', 'familieleden'],
      'vrienden': ['sociale contacten', 'vriendenkring', 'kennissen', 'relaties', 'sociale'],
      'hobby\'s': ['vrije tijd', 'interesses', 'bezigheden', 'activiteiten', 'passies'],
      'reizen': ['vakanties', 'uitstapjes', 'trips', 'toerisme', 'uitjes'],
      'wonen': ['huisvesting', 'thuis', 'leefomgeving', 'woonomgeving', 'huis']
    }
    
    // Check for exact matches first
    const exactMatch = dutchSynonyms[text.toLowerCase()]
    if (exactMatch) {
      synonyms.push(...exactMatch)
    }
    
    // Check for partial matches
    Object.entries(dutchSynonyms).forEach(([key, values]) => {
      if (text.toLowerCase().includes(key) || key.includes(text.toLowerCase())) {
        synonyms.push(...values)
      }
    })
  }
  
  // English synonyms
  if (language === 'en') {
    const englishSynonyms: Record<string, string[]> = {
      'tasks': ['activities', 'jobs', 'assignments', 'duties', 'work items'],
      'projects': ['initiatives', 'ventures', 'programs', 'undertakings', 'endeavors'],
      'ideas': ['concepts', 'thoughts', 'insights', 'notions', 'brainwaves'],
      'planning': ['scheduling', 'organization', 'arrangement', 'coordination', 'preparation'],
      'meetings': ['appointments', 'sessions', 'conferences', 'gatherings', 'discussions'],
      
      'professional': ['business', 'work-related', 'career', 'corporate', 'occupational'],
      'personal': ['private', 'individual', 'own', 'self', 'personal life'],
      'administration': ['management', 'organization', 'coordination', 'oversight', 'handling'],
      'communication': ['contact', 'correspondence', 'interaction', 'exchange', 'dialogue'],
      'finance': ['money', 'budget', 'financial', 'economics', 'monetary'],
      'health': ['wellness', 'fitness', 'medical', 'wellbeing', 'healthcare'],
      'family': ['relatives', 'household', 'home life', 'family members', 'kinfolk'],
      'friends': ['social contacts', 'acquaintances', 'companions', 'social circle', 'peers'],
      'hobbies': ['interests', 'pastimes', 'activities', 'pursuits', 'leisure'],
      'travel': ['trips', 'journeys', 'vacations', 'tourism', 'excursions'],
      'living': ['housing', 'home', 'residence', 'accommodation', 'dwelling']
    }
    
    const exactMatch = englishSynonyms[text.toLowerCase()]
    if (exactMatch) {
      synonyms.push(...exactMatch)
    }
    
    Object.entries(englishSynonyms).forEach(([key, values]) => {
      if (text.toLowerCase().includes(key) || key.includes(text.toLowerCase())) {
        synonyms.push(...values)
      }
    })
  }
  
  // German synonyms
  if (language === 'de') {
    const germanSynonyms: Record<string, string[]> = {
      'aufgaben': ['tätigkeiten', 'arbeiten', 'jobs', 'pflichten', 'arbeitsschritte'],
      'projekte': ['vorhaben', 'unternehmungen', 'programme', 'initiativen', 'pläne'],
      'ideen': ['konzepte', 'gedanken', 'einfälle', 'inspirationen', 'vorstellungen'],
      'planung': ['organisation', 'terminplanung', 'koordination', 'vorbereitung', 'strukturierung'],
      'termine': ['besprechungen', 'meetings', 'sitzungen', 'gespräche', 'verabredungen'],
      
      'beruflich': ['geschäftlich', 'arbeitsbezogen', 'karriere', 'professionell', 'berufsbezogen'],
      'persönlich': ['privat', 'individuell', 'eigen', 'persönliche', 'selbst'],
      'verwaltung': ['management', 'organisation', 'koordination', 'betreuung', 'führung'],
      'kommunikation': ['kontakt', 'korrespondenz', 'austausch', 'verbindung', 'dialog'],
      'finanzen': ['geld', 'budget', 'finanzierung', 'wirtschaft', 'geldsachen'],
      'gesundheit': ['wohlbefinden', 'fitness', 'medizin', 'pflege', 'körperlich'],
      'familie': ['angehörige', 'haushalt', 'zuhause', 'verwandte', 'familienleben'],
      'freunde': ['soziale kontakte', 'bekannte', 'freundeskreis', 'beziehungen', 'sozial'],
      'hobbys': ['freizeit', 'interessen', 'beschäftigungen', 'aktivitäten', 'leidenschaften'],
      'reisen': ['urlaub', 'ausflüge', 'trips', 'tourismus', 'unternehmungen'],
      'wohnen': ['zuhause', 'wohnung', 'lebensraum', 'wohnumgebung', 'heim']
    }
    
    const exactMatch = germanSynonyms[text.toLowerCase()]
    if (exactMatch) {
      synonyms.push(...exactMatch)
    }
    
    Object.entries(germanSynonyms).forEach(([key, values]) => {
      if (text.toLowerCase().includes(key) || key.includes(text.toLowerCase())) {
        synonyms.push(...values)
      }
    })
  }
  
  // Remove duplicates and original text
  const uniqueSynonyms = [...new Set(synonyms)]
    .filter(synonym => synonym.toLowerCase() !== text.toLowerCase())
    .filter(synonym => synonym.trim().length > 0)
  
  return uniqueSynonyms
}