import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email, firstname, lastname, name } = await request.json()
    
    // Basic email validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Geldig email adres is verplicht' },
        { status: 400 }
      )
    }
    
    // Get client info for tracking
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || ''
    const referrer = request.headers.get('referer') || request.headers.get('referrer') || ''
    
    // Determine the name to use
    const displayName = (firstname && lastname) ? `${firstname} ${lastname}` : 
                       (name || firstname || 'MindDump User')
    
    // Insert into MindDump waitlist
    const { data, error } = await supabase
      .from('minddump_waitlist')
      .insert([
        {
          email: email.toLowerCase().trim(),
          naam: displayName,
          ip_address: ipAddress,
          user_agent: userAgent,
          referrer: referrer
        }
      ])
      .select()
      .single()
    
    if (error) {
      console.error('MindDump waitlist signup error:', error)
      
      // Handle duplicate email
      if (error.code === '23505') {
        return NextResponse.json(
          { 
            error: 'Dit email adres staat al op de MindDump wachtlijst',
            already_exists: true 
          },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: 'Er is een fout opgetreden. Probeer het later opnieuw.' },
        { status: 500 }
      )
    }
    
    console.log(`✅ New MindDump waitlist signup: ${email}`)
    
    // Add to GoHighLevel if API key is configured
    if (process.env.GHL_API_KEY) {
      try {
        const locationId = process.env.GHL_LOCATION_ID || 'FLRLwGihIMJsxbRS39Kt'
        
        // First, search for existing contact by email
        const searchResponse = await fetch(
          `https://services.leadconnectorhq.com/contacts/search/duplicate?locationId=${locationId}&email=${encodeURIComponent(email.toLowerCase().trim())}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
              'Content-Type': 'application/json',
              'Version': '2021-07-28'
            }
          }
        )

        let contactId = null

        if (searchResponse.ok) {
          const searchData = await searchResponse.json()
          if (searchData.contact && searchData.contact.id) {
            contactId = searchData.contact.id
            console.log(`📍 Found existing contact: ${contactId}`)
          }
        }

        if (!contactId) {
          // Create new contact
          const createResponse = await fetch('https://services.leadconnectorhq.com/contacts/', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
              'Content-Type': 'application/json',
              'Version': '2021-07-28'
            },
            body: JSON.stringify({
              email: email.toLowerCase().trim(),
              firstName: firstname || (name ? name.split(' ')[0] : 'MindDump'),
              lastName: lastname || (name ? (name.split(' ').slice(1).join(' ') || 'User') : 'User'), 
              name: displayName,
              locationId: locationId,
              tags: ['minddump-waitlist-signup'],
              source: 'minddump-waitlist',
              customFields: [
                {
                  id: 'source',
                  field_value: 'MindDump Waitlist'
                }
              ]
            })
          })

          if (createResponse.ok) {
            const createData = await createResponse.json()
            contactId = createData.contact?.id
            console.log(`✅ New MindDump contact created: ${contactId}`)
          }
        } else {
          // Add tag to existing contact
          const tagResponse = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/tags`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
              'Content-Type': 'application/json',
              'Version': '2021-07-28'
            },
            body: JSON.stringify({
              tags: ['minddump-waitlist-signup']
            })
          })

          if (tagResponse.ok) {
            console.log(`✅ MindDump tag added to existing contact: ${contactId}`)
          }
        }

      } catch (ghlError) {
        console.error('⚠️ GoHighLevel MindDump integration error:', ghlError)
      }
    }
    
    // Get total waitlist count
    const { count, error: countError } = await supabase
      .from('minddump_waitlist')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('Error getting waitlist count:', countError)
    }
    
    const totalCount = count || 1
    
    return NextResponse.json({ 
      success: true, 
      message: 'Je staat nu op de MindDump wachtlijst!',
      position: totalCount,
      id: data.id
    })
    
  } catch (error) {
    console.error('MindDump waitlist signup error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden. Probeer het later opnieuw.' },
      { status: 500 }
    )
  }
}