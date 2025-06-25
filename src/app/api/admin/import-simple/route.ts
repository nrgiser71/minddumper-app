import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Simplified trigger words - just the core words from your PDFs
const triggerWords = [
  // PROFESSIONEEL
  'Gestart maar niet afgerond',
  'Nog te starten', 
  'Nog te beoordelen',
  'Baas, Partners, Adviseurs',
  'Coaches, Beleidspartners',
  'Collega\'s, Ondergeschikten',
  'Andere medewerkers in de organisatie',
  'Andere deskundigen',
  'Klanten, Andere organisaties',
  'Telefoontjes, E-mails',
  'Voicemails, Brieven',
  'Memo\'s, Tekstberichten',
  'Berichten op sociale media',
  'Rapporten, Evaluaties',
  'Reflectie, Voorstellen',
  'Artikelen, Marketingmateriaal',
  'Instructies, Samenvattingen',
  'Notulen, Redactiewerk',
  'Statusrapporten, Registratie',
  'Gesprekken, Mededelingen',
  'Boeken, Tijdschriften',
  'Artikels, Afdrukken',
  'Websites, Blogs',
  'RSS berichten, Podcasts',
  'Cash flow, Budgetten',
  'Balansposten',
  'Winst- en verliesrekening',
  'Prognoses, Kredietgrens',
  'Debiteuren, Crediteuren',
  'Kleine kas, Banken',
  'Investeerders',
  'Bedrijfsmiddelenbeheer',
  'Doelstellingen',
  'Operationele doelen',
  'Bedrijfsplannen',
  'Marketingplannen',
  'Financiële plannen',
  'Speciale/belangrijke gebeurtenissen',
  'Presentaties, Vergaderingen',
  'Conferenties, Reizen',
  'Vakantie, Zakenreizen',
  'Organisatieschema',
  'Reorganisatie, Bevoegdheden',
  'Taakomschrijvingen',
  'Facilitietten, Nieuwe systemen',
  'Leiderschap',
  'Initiatieven tot verandering',
  'Planning opvolging, Cultuur',
  'Campagnes, Materialen',
  'Public relations',
  'Juridische kwesties',
  'Verzekeringen',
  'Personeelszaken',
  'Personeelsbezetting',
  'Beleid/procedures, Training',
  'Werving, Ontslag',
  'Functioneringsgesprekken',
  'Communicatie',
  'Deskundigheidsbevordering',
  'Moreel, Feedback',
  'Vergoedingen',
  'Mobiele apparatuur',
  'Telefoons, Computers',
  'Software, Databases',
  'Kantooruitrusting, Printers',
  'Archiveren, Opslag',
  'Meubels, Verlichting',
  'Decoraties, Bevoorrading',
  'Visitekaartjes',
  'Kantoorbenodigdheden',
  'Persoonlijke/elektronische organizers',
  'Klanten, Potentiële klanten',
  'Belangrijkste klanten',
  'Verkoopproces, Training',
  'Bouw aan klantenrelaties',
  'Rapportage',
  'Beheer klantenrelaties',
  'Klantenservice',
  'Komende vergaderingen',
  'Te plannen/verzocht',
  'Evalueren',
  'Informatie',
  'Gedelegeerde taken/projecten',
  'Projectonderdelen',
  'Antwoord op berichten',
  'Reacties op voorstellen',
  'Antwoord op vragen',
  'Ingediende verzoeken',
  'Tickets',
  'Externe acties',
  'Beslissingen, Wijzigingen',
  'Implementaties, Bestellingen',
  'Training, Workshops',
  'Nog te leren dingen',
  'Dingen op uit te zoeken',
  'Vaardigheden ontwikkelen',
  'Boeken om te lezen',
  'Onderzoek, Formele studie',
  'Diploma\'s, titels',
  'Onderzoek carrièremogelijkheden',
  'CV',
  'Werk',
  
  // PERSOONLIJK  
  'Dienstverlening, Gemeenschap',
  'Vrijwilligerswerk',
  'Spirituele organisaties',
  'Levenspartner, Kinderen',
  'Ouders, Familie',
  'Vrienden, Geleende zaken',
  'Kaarten, Bedankjes',
  'Verjaardagen, Vieringen',
  'Jubilea, Huwelijken',
  'Afstuderen, Recepties',
  'Uitjes, Feestdagen',
  'Vakanties, Etentjes',
  'Feestjes',
  'Culturele evenementen',
  'Sportevenementen',
  'Kantoorartikelen',
  'Apparatuur, Audiovisuele media',
  'Voicemail, Internet',
  'Televisie, Amusement',
  'Archiveren, Hulpmiddelen',
  'Dataopslag/back-up',
  'Muziek, Video',
  'Plekken om te bezoeken',
  'Mensen om te bezoeken',
  'Surfen op het web',
  'Fotografie, Sportuitrusting',
  'Hobbies, Koken, Recreatie',
  'Rekeningen, Investeringen',
  'Leningen, Belasting',
  'Budget, Hypotheek',
  'Boekhouding, Boekhouders',
  'Gezondheid, Dierbenodigdheden',
  'Testament, Onroerend goed',
  'Juridische zaken',
  'Bestellingen, Reparaties',
  'Vergoedingen',
  'Uitgeleende items',
  'Toezeggingen',
  'Projecten / activiteiten',
  'met levenspartner',
  'Verwanten',
  'Onroerend goed, Verbouwing',
  'Renovatie, Huisbaas',
  'Verwarming en airconditioning',
  'Sanitair, Nutsvoorzieningen',
  'Dak, Tuinieren',
  'Oprit, Garage',
  'Muren, Vloeren, Plafonds',
  'Decoratie, Apparatuur',
  'Verlichting en bedrading',
  'Keukenvoorraad',
  'Was, Opruimen',
  'Schoonmaken, Organiseren',
  'Artsen, Tandarts, Opticien',
  'Gezondheidswerkers',
  'Controles',
  'Voedingsgewoonten',
  'Voeding, Beweging',
  'Cursussen, Opleidingen',
  'Coaching / loopbaanadvies',
  'Carrière, Creatieve expressie',
  'Auto, Fietsen, Motoren',
  'Onderhoud, Forens',
  'Reserveringen',
  'Werkkleding',
  'Vrijetijdskleding',
  'Formele kleding',
  'Sportkleding, Accessoires',
  'Bagage, Herstellingen',
  'Kleding verstellen',
  'Winkelen / winkels',
  'Huishoudelijke artikelen',
  'Cadeautjes, Levensmiddelen',
  'Drogist, Schoonmaak',
  'Buurt, Buren',
  'Dienstverlening, Scholen',
  'Maatschappelijke betrokkenheid'
]

export async function POST() {
  try {
    console.log('🚀 Importing simplified trigger words...')

    // Clear existing Dutch trigger words
    console.log('🗑️ Clearing old Dutch trigger words...')
    const { error: deleteError } = await supabase
      .from('trigger_words')
      .delete()
      .eq('language', 'nl')

    if (deleteError) {
      console.error('Warning: Could not clear old data:', deleteError)
    }

    console.log('📝 Inserting new trigger words...')
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < triggerWords.length; i++) {
      const word = triggerWords[i]
      const { error } = await supabase
        .from('trigger_words')
        .insert({
          language: 'nl',
          word: word,
          category: i < 95 ? 'professional' : 'personal', // First ~95 are professional
          is_active: true
        })

      if (error) {
        console.error(`Error inserting word "${word}":`, error)
        errorCount++
      } else {
        successCount++
      }
    }

    console.log('✅ Import completed!')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Simplified trigger words imported successfully!',
      totalWords: triggerWords.length,
      successCount,
      errorCount,
      professionalWords: 95,
      personalWords: triggerWords.length - 95
    })

  } catch (error) {
    console.error('❌ Error importing trigger words:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to import simplified trigger words',
    usage: 'POST /api/admin/import-simple'
  })
}