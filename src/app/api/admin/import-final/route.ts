import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const triggerWordsData = [
  // PROFESSIONEEL
  { mainCategory: 'Professioneel', subCategory: 'Projecten', words: ['Gestart maar niet afgerond', 'Nog te starten', 'Nog te beoordelen'] },
  
  { mainCategory: 'Professioneel', subCategory: 'Verplichtingen/beloften aan anderen', words: ['Baas', 'Partners', 'Adviseurs', 'Coaches', 'Beleidspartners', 'Collega\'s', 'Ondergeschikten', 'Andere medewerkers in de organisatie', 'Andere deskundigen', 'Klanten', 'Andere organisaties'] },
  
  { mainCategory: 'Professioneel', subCategory: 'Communicatie zelf initiëren/reageren op', words: ['Telefoontjes', 'E-mails', 'Voicemails', 'Brieven', 'Memo\'s', 'Tekstberichten', 'Berichten op sociale media'] },
  
  { mainCategory: 'Professioneel', subCategory: 'Schrijfwerk: te doen/in te leveren', words: ['Rapporten', 'Evaluaties', 'Reflectie', 'Voorstellen', 'Artikelen', 'Marketingmateriaal', 'Instructies', 'Samenvattingen', 'Notulen', 'Redactiewerk', 'Statusrapporten', 'Registratie', 'Gesprekken', 'Mededelingen'] },
  
  { mainCategory: 'Professioneel', subCategory: 'Lezen/bekijken', words: ['Boeken', 'Tijdschriften', 'Artikels', 'Afdrukken', 'Websites', 'Blogs', 'RSS berichten', 'Podcasts'] },
  
  { mainCategory: 'Professioneel', subCategory: 'Financieel', words: ['Cash flow', 'Budgetten', 'Balansposten', 'Winst- en verliesrekening', 'Prognoses', 'Kredietgrens', 'Debiteuren', 'Crediteuren', 'Kleine kas', 'Banken', 'Investeerders', 'Bedrijfsmiddelenbeheer'] },
  
  { mainCategory: 'Professioneel', subCategory: 'Planning/organisatie', words: ['Doelstellingen', 'Operationele doelen', 'Bedrijfsplannen', 'Marketingplannen', 'Financiële plannen', 'Speciale/belangrijke gebeurtenissen', 'Presentaties', 'Vergaderingen', 'Conferenties', 'Reizen', 'Vakantie', 'Zakenreizen'] },
  
  { mainCategory: 'Professioneel', subCategory: 'Organisatieontwikkeling', words: ['Organisatieschema', 'Reorganisatie', 'Bevoegdheden', 'Taakomschrijvingen', 'Facilitietten', 'Nieuwe systemen', 'Leiderschap', 'Initiatieven tot verandering', 'Planning opvolging', 'Cultuur'] },
  
  { mainCategory: 'Professioneel', subCategory: 'Marketing/promotie', words: ['Campagnes', 'Materialen', 'Public relations'] },
  
  { mainCategory: 'Professioneel', subCategory: 'Administratie', words: ['Juridische kwesties', 'Verzekeringen', 'Personeelszaken', 'Personeelsbezetting', 'Beleid/procedures', 'Training'] },
  
  { mainCategory: 'Professioneel', subCategory: 'Medewerkers', words: ['Werving', 'Ontslag', 'Functioneringsgesprekken', 'Communicatie', 'Deskundigheidsbevordering', 'Moreel', 'Feedback', 'Vergoedingen'] },
  
  { mainCategory: 'Professioneel', subCategory: 'Systemen', words: ['Mobiele apparatuur', 'Telefoons', 'Computers', 'Software', 'Databases', 'Kantooruitrusting', 'Printers', 'Archiveren', 'Opslag', 'Meubels', 'Verlichting', 'Decoraties', 'Bevoorrading', 'Visitekaartjes', 'Kantoorbenodigdheden', 'Persoonlijke/elektronische organizers'] },
  
  { mainCategory: 'Professioneel', subCategory: 'Verkoop', words: ['Klanten', 'Potentiële klanten', 'Belangrijkste klanten', 'Verkoopproces', 'Training', 'Bouw aan klantenrelaties', 'Rapportage', 'Beheer klantenrelaties', 'Klantenservice'] },
  
  { mainCategory: 'Professioneel', subCategory: 'Vergaderingen', words: ['Komende', 'Te plannen/verzocht', 'Evalueren'] },
  
  { mainCategory: 'Professioneel', subCategory: 'Wachten op', words: ['Informatie', 'Gedelegeerde taken/projecten', 'Projectonderdelen', 'Antwoord op berichten', 'Reacties op voorstellen', 'Antwoord op vragen', 'Ingediende verzoeken om reacties/vergoeding', 'Tickets', 'Externe acties die nodig zijn om projecten te continueren of af te ronden. (Beslissingen', 'Wijzigingen', 'Implementaties,enz)', 'Bestellingen'] },
  
  { mainCategory: 'Professioneel', subCategory: 'Professionele ontwikkeling', words: ['Training', 'Workshops', 'Nog te leren dingen', 'Dingen op uit te zoeken', 'Vaardigheden om te ontwikkelen of oefenen', 'Boeken om te lezen', 'Onderzoek', 'Formele studie (diploma\'s, titels)', 'Onderzoek carrièremogelijkheden', 'CV'] },
  
  { mainCategory: 'Professioneel', subCategory: 'Kledingkast', words: ['Werk'] },

  // PERSOONLIJK
  { mainCategory: 'Persoonlijk', subCategory: 'Projecten', words: ['Gestart maar niet afgerond', 'Nog te starten'] },
  
  { mainCategory: 'Persoonlijk', subCategory: 'Projecten - andere organisaties', words: ['Dienstverlening', 'Gemeenschap', 'Vrijwilligerswerk', 'Spirituele organisaties'] },
  
  { mainCategory: 'Persoonlijk', subCategory: 'Verplichtingen/beloften aan anderen', words: ['Levenspartner', 'Kinderen', 'Ouders', 'Familie', 'Vrienden', 'Collega\'s', 'Geleende zaken'] },
  
  { mainCategory: 'Persoonlijk', subCategory: 'Communicatie zelf initiëren / reageren op', words: ['Telefoontjes', 'E-mails', 'Kaarten', 'Brieven', 'Bedankjes', 'Tekstberichten', 'Berichten op sociale media'] },
  
  { mainCategory: 'Persoonlijk', subCategory: 'Speciale gebeurtenissen', words: ['Verjaardagen', 'Vieringen / jubilea', 'Huwelijken', 'Afstuderen', 'Recepties', 'Uitjes', 'Feestdagen', 'Vakanties', 'Reizen', 'Etentjes', 'Feestjes', 'Culturele evenementen', 'Sportevenementen'] },
  
  { mainCategory: 'Persoonlijk', subCategory: 'Administratie', words: ['Kantoorartikelen', 'Apparatuur', 'Telefoons', 'Audiovisuele media', 'Voicemail', 'Computers', 'Internet', 'Televisie', 'Apparaten', 'Amusement', 'Archiveren', 'Opslag', 'Hulpmiddelen', 'Dataopslag/back-up'] },
  
  { mainCategory: 'Persoonlijk', subCategory: 'Ontspanning', words: ['Boeken', 'Muziek', 'Video', 'Reizen', 'Plekken om te bezoeken', 'Mensen om te bezoeken', 'Surfen op het web', 'Fotografie', 'Sportuitrusting', 'Hobbies', 'Koken', 'Recreatie'] },
  
  { mainCategory: 'Persoonlijk', subCategory: 'Financieel', words: ['Rekeningen', 'Banken', 'Investeringen', 'Leningen', 'Belasting', 'Budget', 'Verzekeringen', 'Hypotheek', 'Boekhouding', 'Boekhouders'] },
  
  { mainCategory: 'Persoonlijk', subCategory: 'Huisdieren', words: ['Gezondheid', 'Training', 'Dierbenodigdheden'] },
  
  { mainCategory: 'Persoonlijk', subCategory: 'Juridisch', words: ['Testament', 'Onroerend goed', 'Juridische zaken'] },
  
  { mainCategory: 'Persoonlijk', subCategory: 'Wachten op', words: ['Bestellingen', 'Reparaties', 'Vergoedingen', 'Uitgeleende items', 'Informatie', 'Toezeggingen'] },
  
  { mainCategory: 'Persoonlijk', subCategory: 'Familie', words: ['Projecten / activiteiten met levenspartner', 'Kinderen', 'Ouders', 'Verwanten'] },
  
  { mainCategory: 'Persoonlijk', subCategory: 'Huis/Huishouding', words: ['Onroerend goed', 'Reparaties', 'Verbouwing', 'Renovatie', 'Huisbaas', 'Verwarming en airconditioning', 'Sanitair', 'Nutsvoorzieningen', 'Dak', 'Tuinieren', 'Oprit', 'Garage', 'Muren', 'Vloeren', 'Plafonds', 'Decoratie', 'Meubels', 'Apparatuur', 'Verlichting en bedrading', 'Keukenvoorraad en apparatuur', 'Was', 'Opruimen', 'Schoonmaken', 'Organiseren', 'Opslag'] },
  
  { mainCategory: 'Persoonlijk', subCategory: 'Gezondheid', words: ['Artsen', 'Tandarts', 'Opticien', 'Gezondheidswerkers', 'Controles', 'Voedingsgewoonten', 'Voeding', 'Beweging'] },
  
  { mainCategory: 'Persoonlijk', subCategory: 'Persoonlijke ontwikkeling', words: ['Cursussen', 'Workshops', 'Opleidingen', 'Coaching / loopbaanadvies', 'Carrière', 'Creatieve expressie'] },
  
  { mainCategory: 'Persoonlijk', subCategory: 'Vervoer', words: ['Auto', 'Fietsen', 'Motoren', 'Onderhoud', 'Reparaties', 'Forens', 'Reserveringen'] },
  
  { mainCategory: 'Persoonlijk', subCategory: 'Kleding', words: ['Werkkleding', 'Vrijetijdskleding', 'Formele kleding', 'Sportkleding', 'Accessoires', 'Bagage', 'Herstellingen', 'Kleding verstellen'] },
  
  { mainCategory: 'Persoonlijk', subCategory: 'Boodschappen', words: ['Winkelen / winkels', 'Huishoudelijke artikelen / apparatuur', 'Kantoorartikelen', 'Cadeautjes', 'Levensmiddelen', 'Drogist', 'Bank', 'Schoonmaak'] },
  
  { mainCategory: 'Persoonlijk', subCategory: 'Wijk', words: ['Buurt', 'Buren', 'Dienstverlening', 'Scholen', 'Maatschappelijke betrokkenheid'] }
]

export async function POST() {
  try {
    // Importing final correct trigger words structure

    let successCount = 0
    let errorCount = 0
    let totalWords = 0

    for (const categoryData of triggerWordsData) {
      for (const word of categoryData.words) {
        totalWords++
        const { error } = await supabase
          .from('trigger_words')
          .insert({
            language: 'nl',
            word: word,
            category: categoryData.subCategory,
            is_active: true
          })

        if (error) {
          // Error inserting word
          errorCount++
        } else {
          successCount++
        }
      }
    }

    // Final trigger words import completed
    
    // Count by main categories
    const professionalCount = triggerWordsData
      .filter(c => c.mainCategory === 'Professioneel')
      .reduce((sum, c) => sum + c.words.length, 0)
    
    const personalCount = triggerWordsData
      .filter(c => c.mainCategory === 'Persoonlijk')
      .reduce((sum, c) => sum + c.words.length, 0)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Final trigger words imported with completely correct structure!',
      totalWords,
      successCount,
      errorCount,
      professionalWords: professionalCount,
      personalWords: personalCount,
      professionalCategories: triggerWordsData.filter(c => c.mainCategory === 'Professioneel').length,
      personalCategories: triggerWordsData.filter(c => c.mainCategory === 'Persoonlijk').length
    })

  } catch (error) {
    // Error importing final trigger words
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to import final correct trigger words structure',
    usage: 'POST /api/admin/import-final'
  })
}