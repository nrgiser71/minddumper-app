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

    // Simple synonym generation based on common patterns
    const synonyms = generateSynonyms(text, type, language)

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