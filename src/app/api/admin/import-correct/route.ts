import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Correct structure from PDFs - Personal category
const personalTriggerWords = [
  // Projecten
  { category: 'Projecten', words: ['Gestart maar niet afgerond', 'Nog te starten'] },
  
  // Projecten - andere organisaties  
  { category: 'Projecten - andere organisaties', words: ['Dienstverlening', 'Gemeenschap', 'Vrijwilligerswerk', 'Spirituele organisaties'] },
  
  // Verplichtingen/beloften aan anderen
  { category: 'Verplichtingen/beloften aan anderen', words: ['Levenspartner', 'Kinderen', 'Ouders', 'Familie', 'Vrienden', 'Collega\'s', 'Geleende zaken'] },
  
  // Communicatie zelf initiëren / reageren op
  { category: 'Communicatie zelf initiëren / reageren op', words: ['Telefoontjes', 'E-mails', 'Kaarten', 'Brieven', 'Bedankjes', 'Tekstberichten', 'Berichten op sociale media'] },
  
  // Speciale gebeurtenissen  
  { category: 'Speciale gebeurtenissen', words: ['Verjaardagen', 'Vieringen / jubilea', 'Huwelijken', 'Afstuderen', 'Recepties', 'Uitjes', 'Feestdagen', 'Vakanties', 'Reizen', 'Etentjes', 'Feestjes', 'Culturele evenementen', 'Sportevenementen'] },
  
  // Administratie
  { category: 'Administratie', words: ['Kantoorartikelen', 'Apparatuur', 'Telefoons', 'Audiovisuele media', 'Voicemail', 'Computers', 'Internet', 'Televisie', 'Apparaten', 'Amusement', 'Archiveren', 'Opslag', 'Hulpmiddelen', 'Dataopslag/back-up'] },
  
  // Ontspanning
  { category: 'Ontspanning', words: ['Boeken', 'Muziek', 'Video', 'Reizen', 'Plekken om te bezoeken', 'Mensen om te bezoeken', 'Surfen op het web', 'Fotografie', 'Sportuitrusting', 'Hobbies', 'Koken', 'Recreatie'] },
  
  // Financieel
  { category: 'Financieel', words: ['Rekeningen', 'Banken', 'Investeringen', 'Leningen', 'Belasting', 'Budget', 'Verzekeringen', 'Hypotheek', 'Boekhouding', 'Boekhouders'] },
  
  // Huisdieren
  { category: 'Huisdieren', words: ['Gezondheid', 'Training', 'Dierbenodigdheden'] },
  
  // Juridisch
  { category: 'Juridisch', words: ['Testament', 'Onroerend goed', 'Juridische zaken'] },
  
  // Wachten op
  { category: 'Wachten op', words: ['Bestellingen', 'Reparaties', 'Vergoedingen', 'Uitgeleende items', 'Informatie', 'Toezeggingen'] },
  
  // Familie
  { category: 'Familie', words: ['Projecten / activiteiten met levenspartner', 'Kinderen', 'Ouders', 'Verwanten'] },
  
  // Huis/Huishouding
  { category: 'Huis/Huishouding', words: ['Onroerend goed', 'Reparaties', 'Verbouwing', 'Renovatie', 'Huisbaas', 'Verwarming en airconditioning', 'Sanitair', 'Nutsvoorzieningen', 'Dak', 'Tuinieren', 'Oprit', 'Garage', 'Muren', 'Vloeren', 'Plafonds', 'Decoratie', 'Meubels', 'Apparatuur', 'Verlichting en bedrading', 'Keukenvoorraad en apparatuur', 'Was', 'Opruimen', 'Schoonmaken', 'Organiseren', 'Opslag'] },
  
  // Gezondheid
  { category: 'Gezondheid', words: ['Artsen', 'Tandarts', 'Opticien', 'Gezondheidswerkers', 'Controles', 'Voedingsgewoonten', 'Voeding', 'Beweging'] },
  
  // Persoonlijke ontwikkeling
  { category: 'Persoonlijke ontwikkeling', words: ['Cursussen', 'Workshops', 'Opleidingen', 'Coaching / loopbaanadvies', 'Carrière', 'Creatieve expressie'] },
  
  // Vervoer
  { category: 'Vervoer', words: ['Auto', 'Fietsen', 'Motoren', 'Onderhoud', 'Reparaties', 'Forens', 'Reserveringen'] },
  
  // Kleding
  { category: 'Kleding', words: ['Werkkleding', 'Vrijetijdskleding', 'Formele kleding', 'Sportkleding', 'Accessoires', 'Bagage', 'Herstellingen', 'Kleding verstellen'] },
  
  // Boodschappen
  { category: 'Boodschappen', words: ['Winkelen / winkels', 'Huishoudelijke artikelen / apparatuur', 'Kantoorartikelen', 'Cadeautjes', 'Levensmiddelen', 'Drogist', 'Bank', 'Schoonmaak'] },
  
  // Wijk
  { category: 'Wijk', words: ['Buurt', 'Buren', 'Dienstverlening', 'Scholen', 'Maatschappelijke betrokkenheid'] }
]

export async function POST() {
  try {
    // Importing correctly structured personal trigger words

    let successCount = 0
    let errorCount = 0

    for (const categoryData of personalTriggerWords) {
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
          // Error inserting word
          errorCount++
        } else {
          successCount++
        }
      }
    }

    // Personal trigger words import completed
    
    return NextResponse.json({ 
      success: true, 
      message: 'Personal trigger words imported with correct structure!',
      successCount,
      errorCount,
      categories: personalTriggerWords.length
    })

  } catch (error) {
    // Error importing personal trigger words
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to import correctly structured personal trigger words',
    usage: 'POST /api/admin/import-correct'
  })
}