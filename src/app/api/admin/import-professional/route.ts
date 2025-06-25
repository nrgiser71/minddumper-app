import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Correct structure from PDFs - Professional category
const professionalTriggerWords = [
  // Projecten
  { category: 'Projecten', words: ['Gestart maar niet afgerond', 'Nog te starten', 'Nog te beoordelen'] },
  
  // Verplichtingen/beloften aan anderen  
  { category: 'Verplichtingen/beloften aan anderen', words: ['Baas', 'Partners', 'Adviseurs', 'Coaches', 'Beleidspartners', 'Collega\'s', 'Ondergeschikten', 'Andere medewerkers in de organisatie', 'Andere deskundigen', 'Klanten', 'Andere organisaties'] },
  
  // Communicatie zelf initiëren/reageren op
  { category: 'Communicatie zelf initiëren/reageren op', words: ['Telefoontjes', 'E-mails', 'Voicemails', 'Brieven', 'Memo\'s', 'Tekstberichten', 'Berichten op sociale media'] },
  
  // Schrijfwerk: te doen/in te leveren  
  { category: 'Schrijfwerk: te doen/in te leveren', words: ['Rapporten', 'Evaluaties', 'Reflectie', 'Voorstellen', 'Artikelen', 'Marketingmateriaal', 'Instructies', 'Samenvattingen', 'Notulen', 'Redactiewerk', 'Statusrapporten', 'Registratie', 'Gesprekken', 'Mededelingen'] },
  
  // Lezen/bekijken
  { category: 'Lezen/bekijken', words: ['Boeken', 'Tijdschriften', 'Artikels', 'Afdrukken', 'Websites', 'Blogs', 'RSS berichten', 'Podcasts'] },
  
  // Financieel
  { category: 'Financieel', words: ['Cash flow', 'Budgetten', 'Balansposten', 'Winst- en verliesrekening', 'Prognoses', 'Kredietgrens', 'Debiteuren', 'Crediteuren', 'Kleine kas', 'Banken', 'Investeerders', 'Bedrijfsmiddelenbeheer'] },
  
  // Planning/organisatie
  { category: 'Planning/organisatie', words: ['Doelstellingen', 'Operationele doelen', 'Bedrijfsplannen', 'Marketingplannen', 'Financiële plannen', 'Speciale/belangrijke gebeurtenissen', 'Presentaties', 'Vergaderingen', 'Conferenties', 'Reizen', 'Vakantie', 'Zakenreizen'] },
  
  // Organisatieontwikkeling
  { category: 'Organisatieontwikkeling', words: ['Organisatieschema', 'Reorganisatie', 'Bevoegdheden', 'Taakomschrijvingen', 'Facilitietten', 'Nieuwe systemen', 'Leiderschap', 'Initiatieven tot verandering', 'Planning opvolging', 'Cultuur'] },
  
  // Marketing/promotie
  { category: 'Marketing/promotie', words: ['Campagnes', 'Materialen', 'Public relations'] },
  
  // Administratie
  { category: 'Administratie', words: ['Juridische kwesties', 'Verzekeringen', 'Personeelszaken', 'Personeelsbezetting', 'Beleid/procedures', 'Training'] },
  
  // Medewerkers
  { category: 'Medewerkers', words: ['Werving', 'Ontslag', 'Functioneringsgesprekken', 'Communicatie', 'Deskundigheidsbevordering', 'Moreel', 'Feedback', 'Vergoedingen'] },
  
  // Systemen
  { category: 'Systemen', words: ['Mobiele apparatuur', 'Telefoons', 'Computers', 'Software', 'Databases', 'Kantooruitrusting', 'Printers', 'Archiveren', 'Opslag', 'Meubels', 'Verlichting', 'Decoraties', 'Bevoorrading', 'Visitekaartjes', 'Kantoorbenodigdheden', 'Persoonlijke/elektronische organizers'] },
  
  // Verkoop
  { category: 'Verkoop', words: ['Klanten', 'Potentiële klanten', 'Belangrijkste klanten', 'Verkoopproces', 'Training', 'Bouw aan klantenrelaties', 'Rapportage', 'Beheer klantenrelaties', 'Klantenservice'] },
  
  // Vergaderingen
  { category: 'Vergaderingen', words: ['Komende', 'Te plannen/verzocht', 'Evalueren'] },
  
  // Wachten op
  { category: 'Wachten op', words: ['Informatie', 'Gedelegeerde taken/projecten', 'Projectonderdelen', 'Antwoord op berichten', 'Reacties op voorstellen', 'Antwoord op vragen', 'Ingediende verzoeken om reacties/vergoeding', 'Tickets', 'Externe acties die nodig zijn om projecten te continueren of af te ronden. (Beslissingen', 'Wijzigingen', 'Implementaties,enz)', 'Bestellingen'] },
  
  // Professionele ontwikkeling
  { category: 'Professionele ontwikkeling', words: ['Training', 'Workshops', 'Nog te leren dingen', 'Dingen op uit te zoeken', 'Vaardigheden om te ontwikkelen of oefenen', 'Boeken om te lezen', 'Onderzoek', 'Formele studie (diploma\'s, titels)', 'Onderzoek carrièremogelijkheden', 'CV'] },
  
  // Kledingkast
  { category: 'Kledingkast', words: ['Werk'] }
]

export async function POST() {
  try {
    console.log('🚀 Importing correctly structured professional trigger words...')

    let successCount = 0
    let errorCount = 0

    for (const categoryData of professionalTriggerWords) {
      for (const word of categoryData.words) {
        const { error } = await supabase
          .from('trigger_words')
          .insert({
            language: 'nl',
            word: word,
            category: categoryData.category,
            is_active: true
          })

        if (error) {
          console.error(`Error inserting word "${word}":`, error)
          errorCount++
        } else {
          successCount++
        }
      }
    }

    console.log('✅ Professional trigger words import completed!')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Professional trigger words imported with correct structure!',
      successCount,
      errorCount,
      categories: professionalTriggerWords.length
    })

  } catch (error) {
    console.error('❌ Error importing professional trigger words:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to import correctly structured professional trigger words',
    usage: 'POST /api/admin/import-professional'
  })
}