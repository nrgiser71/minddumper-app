import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const triggerWordsData = [
  // PROFESSIONEEL - Main Category Order: 1
  
  // Projecten - Sub Category Order: 1
  { main_category: 'Professioneel', sub_category: 'Projecten', word: 'Gestart maar niet afgerond', main_category_order: 1, sub_category_order: 1, sort_order: 1 },
  { main_category: 'Professioneel', sub_category: 'Projecten', word: 'Nog te starten', main_category_order: 1, sub_category_order: 1, sort_order: 2 },
  { main_category: 'Professioneel', sub_category: 'Projecten', word: 'Nog te beoordelen', main_category_order: 1, sub_category_order: 1, sort_order: 3 },
  
  // Verplichtingen/beloften aan anderen - Sub Category Order: 2
  { main_category: 'Professioneel', sub_category: 'Verplichtingen/beloften aan anderen', word: 'Baas, Partners, Adviseurs, Coaches, Beleidspartners, Collega\'s, Ondergeschikten, Andere medewerkers in de organisatie, Andere deskundigen, Klanten, Andere organisaties', main_category_order: 1, sub_category_order: 2, sort_order: 1 },
  
  // Communicatie zelf initiëren/reageren op - Sub Category Order: 3
  { main_category: 'Professioneel', sub_category: 'Communicatie zelf initiëren/reageren op', word: 'Telefoontjes, E-mails, Voicemails, Brieven, Memo\'s, Tekstberichten, Berichten op sociale media', main_category_order: 1, sub_category_order: 3, sort_order: 1 },
  
  // Schrijfwerk: te doen/in te leveren - Sub Category Order: 4
  { main_category: 'Professioneel', sub_category: 'Schrijfwerk: te doen/in te leveren', word: 'Rapporten, Evaluaties, Reflectie, Voorstellen, Artikelen, Marketingmateriaal, Instructies, Samenvattingen, Notulen, Redactiewerk, Statusrapporten, Registratie, Gesprekken, Mededelingen', main_category_order: 1, sub_category_order: 4, sort_order: 1 },
  
  // Lezen/bekijken - Sub Category Order: 5
  { main_category: 'Professioneel', sub_category: 'Lezen/bekijken', word: 'Boeken, Tijdschriften, Artikels, Afdrukken, Websites, Blogs, RSS berichten, Podcasts', main_category_order: 1, sub_category_order: 5, sort_order: 1 },
  
  // Financieel - Sub Category Order: 6
  { main_category: 'Professioneel', sub_category: 'Financieel', word: 'Cash flow, Budgetten, Balansposten, Winst- en verliesrekening, Prognoses, Kredietgrens, Debiteuren, Crediteuren, Kleine kas, Banken, Investeerders, Bedrijfsmiddelenbeheer', main_category_order: 1, sub_category_order: 6, sort_order: 1 },
  
  // Planning/organisatie - Sub Category Order: 7
  { main_category: 'Professioneel', sub_category: 'Planning/organisatie', word: 'Doelstellingen, Operationele doelen, Bedrijfsplannen, Marketingplannen, Financiële plannen, Speciale/belangrijke gebeurtenissen, Presentaties, Vergaderingen, Conferenties, Reizen, Vakantie, Zakenreizen', main_category_order: 1, sub_category_order: 7, sort_order: 1 },
  
  // Organisatieontwikkeling - Sub Category Order: 8
  { main_category: 'Professioneel', sub_category: 'Organisatieontwikkeling', word: 'Organisatieschema, Reorganisatie, Bevoegdheden, Taakomschrijvingen, Facilitietten, Nieuwe systemen, Leiderschap, Initiatieven tot verandering, Planning opvolging, Cultuur', main_category_order: 1, sub_category_order: 8, sort_order: 1 },
  
  // Marketing/promotie - Sub Category Order: 9
  { main_category: 'Professioneel', sub_category: 'Marketing/promotie', word: 'Campagnes, Materialen, Public relations', main_category_order: 1, sub_category_order: 9, sort_order: 1 },
  
  // Administratie - Sub Category Order: 10
  { main_category: 'Professioneel', sub_category: 'Administratie', word: 'Juridische kwesties, Verzekeringen, Personeelszaken, Personeelsbezetting, Beleid/procedures, Training', main_category_order: 1, sub_category_order: 10, sort_order: 1 },
  
  // Medewerkers - Sub Category Order: 11
  { main_category: 'Professioneel', sub_category: 'Medewerkers', word: 'Werving, Ontslag, Functioneringsgesprekken, Communicatie, Deskundigheidsbevordering, Moreel, Feedback, Vergoedingen', main_category_order: 1, sub_category_order: 11, sort_order: 1 },
  
  // Systemen - Sub Category Order: 12
  { main_category: 'Professioneel', sub_category: 'Systemen', word: 'Mobiele apparatuur, Telefoons, Computers, Software, Databases, Kantooruitrusting, Printers, Archiveren, Opslag, Meubels, Verlichting, Decoraties, Bevoorrading, Visitekaartjes, Kantoorbenodigdheden, Persoonlijke/elektronische organizers', main_category_order: 1, sub_category_order: 12, sort_order: 1 },
  
  // Verkoop - Sub Category Order: 13
  { main_category: 'Professioneel', sub_category: 'Verkoop', word: 'Klanten, Potentiële klanten, Belangrijkste klanten, Verkoopproces, Training, Bouw aan klantenrelaties, Rapportage, Beheer klantenrelaties, Klantenservice', main_category_order: 1, sub_category_order: 13, sort_order: 1 },
  
  // Vergaderingen - Sub Category Order: 14
  { main_category: 'Professioneel', sub_category: 'Vergaderingen', word: 'Komende, Te plannen/verzocht, Evalueren', main_category_order: 1, sub_category_order: 14, sort_order: 1 },
  
  // Wachten op - Sub Category Order: 15
  { main_category: 'Professioneel', sub_category: 'Wachten op', word: 'Informatie, Gedelegeerde taken/projecten, Projectonderdelen, Antwoord op berichten, Reacties op voorstellen, Antwoord op vragen, Ingediende verzoeken om reacties/vergoeding, Tickets, Externe acties die nodig zijn om projecten te continueren of af te ronden. (Beslissingen, Wijzigingen, Implementaties,enz), Bestellingen', main_category_order: 1, sub_category_order: 15, sort_order: 1 },
  
  // Professionele ontwikkeling - Sub Category Order: 16
  { main_category: 'Professioneel', sub_category: 'Professionele ontwikkeling', word: 'Training, Workshops, Nog te leren dingen, Dingen op uit te zoeken, Vaardigheden om te ontwikkelen of oefenen, Boeken om te lezen, Onderzoek, Formele studie (diploma\'s, titels), Onderzoek carrièremogelijkheden, CV', main_category_order: 1, sub_category_order: 16, sort_order: 1 },
  
  // Kledingkast - Sub Category Order: 17
  { main_category: 'Professioneel', sub_category: 'Kledingkast', word: 'Werk', main_category_order: 1, sub_category_order: 17, sort_order: 1 },

  // PERSOONLIJK - Main Category Order: 2
  
  // Projecten - Sub Category Order: 1
  { main_category: 'Persoonlijk', sub_category: 'Projecten', word: 'Gestart maar niet afgerond', main_category_order: 2, sub_category_order: 1, sort_order: 1 },
  { main_category: 'Persoonlijk', sub_category: 'Projecten', word: 'Nog te starten', main_category_order: 2, sub_category_order: 1, sort_order: 2 },
  
  // Projecten - andere organisaties - Sub Category Order: 2
  { main_category: 'Persoonlijk', sub_category: 'Projecten - andere organisaties', word: 'Dienstverlening, Gemeenschap, Vrijwilligerswerk, Spirituele organisaties', main_category_order: 2, sub_category_order: 2, sort_order: 1 },
  
  // Verplichtingen/beloften aan anderen - Sub Category Order: 3
  { main_category: 'Persoonlijk', sub_category: 'Verplichtingen/beloften aan anderen', word: 'Levenspartner, Kinderen, Ouders, Familie, Vrienden, Collega\'s, Geleende zaken', main_category_order: 2, sub_category_order: 3, sort_order: 1 },
  
  // Communicatie zelf initiëren / reageren op - Sub Category Order: 4
  { main_category: 'Persoonlijk', sub_category: 'Communicatie zelf initiëren / reageren op', word: 'Telefoontjes, E-mails, Kaarten, Brieven, Bedankjes, Tekstberichten, Berichten op sociale media', main_category_order: 2, sub_category_order: 4, sort_order: 1 },
  
  // Speciale gebeurtenissen - Sub Category Order: 5
  { main_category: 'Persoonlijk', sub_category: 'Speciale gebeurtenissen', word: 'Verjaardagen, Vieringen / jubilea, Huwelijken, Afstuderen, Recepties, Uitjes, Feestdagen, Vakanties, Reizen, Etentjes, Feestjes, Culturele evenementen, Sportevenementen', main_category_order: 2, sub_category_order: 5, sort_order: 1 },
  
  // Administratie - Sub Category Order: 6
  { main_category: 'Persoonlijk', sub_category: 'Administratie', word: 'Kantoorartikelen, Apparatuur, Telefoons, Audiovisuele media, Voicemail, Computers, Internet, Televisie, Apparaten, Amusement, Archiveren, Opslag, Hulpmiddelen, Dataopslag/back-up', main_category_order: 2, sub_category_order: 6, sort_order: 1 },
  
  // Ontspanning - Sub Category Order: 7
  { main_category: 'Persoonlijk', sub_category: 'Ontspanning', word: 'Boeken, Muziek, Video, Reizen, Plekken om te bezoeken, Mensen om te bezoeken, Surfen op het web, Fotografie, Sportuitrusting, Hobbies, Koken, Recreatie', main_category_order: 2, sub_category_order: 7, sort_order: 1 },
  
  // Financieel - Sub Category Order: 8
  { main_category: 'Persoonlijk', sub_category: 'Financieel', word: 'Rekeningen, Banken, Investeringen, Leningen, Belasting, Budget, Verzekeringen, Hypotheek, Boekhouding, Boekhouders', main_category_order: 2, sub_category_order: 8, sort_order: 1 },
  
  // Huisdieren - Sub Category Order: 9
  { main_category: 'Persoonlijk', sub_category: 'Huisdieren', word: 'Gezondheid, Training, Dierbenodigdheden', main_category_order: 2, sub_category_order: 9, sort_order: 1 },
  
  // Juridisch - Sub Category Order: 10
  { main_category: 'Persoonlijk', sub_category: 'Juridisch', word: 'Testament, Onroerend goed , Juridische zaken', main_category_order: 2, sub_category_order: 10, sort_order: 1 },
  
  // Wachten op - Sub Category Order: 11
  { main_category: 'Persoonlijk', sub_category: 'Wachten op', word: 'Bestellingen, Reparaties, Vergoedingen, Uitgeleende items, Informatie , Toezeggingen', main_category_order: 2, sub_category_order: 11, sort_order: 1 },
  
  // Familie - Sub Category Order: 12
  { main_category: 'Persoonlijk', sub_category: 'Familie', word: 'Projecten / activiteiten met levenspartner, Kinderen, Ouders, Verwanten', main_category_order: 2, sub_category_order: 12, sort_order: 1 },
  
  // Huis/Huishouding - Sub Category Order: 13
  { main_category: 'Persoonlijk', sub_category: 'Huis/Huishouding', word: 'Onroerend goed, Reparaties, Verbouwing, Renovatie, Huisbaas, Verwarming en airconditioning, Sanitair, Nutsvoorzieningen, Dak, Tuinieren, Oprit, Garage, Muren, Vloeren, Plafonds, Decoratie, Meubels, Apparatuur, Verlichting en bedrading, Keukenvoorraad en apparatuur, Was, Opruimen, Schoonmaken, Organiseren, Opslag', main_category_order: 2, sub_category_order: 13, sort_order: 1 },
  
  // Gezondheid - Sub Category Order: 14
  { main_category: 'Persoonlijk', sub_category: 'Gezondheid', word: 'Artsen, Tandarts, Opticien, Gezondheidswerkers, Controles, Voedingsgewoonten, Voeding, Beweging', main_category_order: 2, sub_category_order: 14, sort_order: 1 },
  
  // Persoonlijke ontwikkeling - Sub Category Order: 15
  { main_category: 'Persoonlijk', sub_category: 'Persoonlijke ontwikkeling', word: 'Cursussen, Workshops, Opleidingen, Coaching / loopbaanadvies, Carrière, Creatieve expressie', main_category_order: 2, sub_category_order: 15, sort_order: 1 },
  
  // Vervoer - Sub Category Order: 16
  { main_category: 'Persoonlijk', sub_category: 'Vervoer', word: 'Auto, Fietsen, Motoren, Onderhoud, Reparaties, Forens, Reserveringen', main_category_order: 2, sub_category_order: 16, sort_order: 1 },
  
  // Kleding - Sub Category Order: 17
  { main_category: 'Persoonlijk', sub_category: 'Kleding', word: 'Werkkleding, Vrijetijdskleding, Formele kleding, Sportkleding, Accessoires, Bagage, Herstellingen, Kleding verstellen', main_category_order: 2, sub_category_order: 17, sort_order: 1 },
  
  // Boodschappen - Sub Category Order: 18
  { main_category: 'Persoonlijk', sub_category: 'Boodschappen', word: 'Winkelen / winkels, Huishoudelijke artikelen / apparatuur, Kantoorartikelen, Cadeautjes, Levensmiddelen, Drogist, Bank, Schoonmaak', main_category_order: 2, sub_category_order: 18, sort_order: 1 },
  
  // Wijk - Sub Category Order: 19
  { main_category: 'Persoonlijk', sub_category: 'Wijk', word: 'Buurt, Buren, Dienstverlening, Scholen, Maatschappelijke betrokkenheid', main_category_order: 2, sub_category_order: 19, sort_order: 1 }
]

export async function POST() {
  try {
    console.log('🚀 Importing trigger words from PDFs...')

    // First, clear existing old trigger words
    console.log('🗑️ Clearing old trigger words...')
    const { error: deleteError } = await supabase
      .from('trigger_words')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (deleteError) {
      console.error('Warning: Could not clear old data:', deleteError)
    }

    console.log('📝 Inserting new trigger words...')
    let successCount = 0
    let errorCount = 0

    for (const wordData of triggerWordsData) {
      const { error } = await supabase
        .from('trigger_words')
        .insert({
          language: 'nl',
          word: wordData.word,
          main_category: wordData.main_category,
          sub_category: wordData.sub_category,
          main_category_order: wordData.main_category_order,
          sub_category_order: wordData.sub_category_order,
          sort_order: wordData.sort_order,
          is_active: true,
          category: wordData.sub_category // Keep for backward compatibility
        })

      if (error) {
        console.error(`Error inserting word "${wordData.word}":`, error)
        errorCount++
      } else {
        successCount++
      }
    }

    console.log('✅ Import completed!')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Trigger words imported successfully from PDFs!',
      totalWords: triggerWordsData.length,
      successCount,
      errorCount,
      categories: {
        'Professioneel': triggerWordsData.filter(w => w.main_category === 'Professioneel').length,
        'Persoonlijk': triggerWordsData.filter(w => w.main_category === 'Persoonlijk').length
      }
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
    message: 'Use POST to import trigger words from PDFs',
    usage: 'POST /api/admin/import-trigger-words'
  })
}