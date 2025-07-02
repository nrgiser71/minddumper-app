import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!process.env.GHL_API_KEY) {
      return NextResponse.json(
        { error: 'GoHighLevel API key not configured' },
        { status: 500 }
      )
    }

    const locationId = process.env.GHL_LOCATION_ID || 'FLRLwGihIMJsxbRS39Kt'
    console.log(`🧪 Testing MindDump GHL integration for: ${email}`)
    
    // Search for existing contact by email
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
    let operationType = 'none'

    if (searchResponse.ok) {
      const searchData = await searchResponse.json()
      if (searchData.contact && searchData.contact.id) {
        contactId = searchData.contact.id
        operationType = 'tag_existing'
        console.log(`📍 Found existing contact: ${contactId}`)
      }
    }

    if (!contactId) {
      // Create new contact for testing
      operationType = 'create_new'
      const createResponse = await fetch('https://services.leadconnectorhq.com/contacts/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28'
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          firstName: name ? name.split(' ')[0] : 'Test',
          lastName: name ? (name.split(' ').slice(1).join(' ') || 'User') : 'User',
          name: name || 'Test User',
          locationId: locationId,
          tags: ['minddump-waitlist-signup'],
          source: 'minddump-waitlist-test',
          customFields: [
            {
              id: 'source',
              field_value: 'MindDump Waitlist Test'
            }
          ]
        })
      })

      if (createResponse.ok) {
        const createData = await createResponse.json()
        contactId = createData.contact?.id
        console.log(`✅ New MindDump test contact created: ${contactId}`)
      } else {
        const errorData = await createResponse.text()
        console.error('Create contact error:', errorData)
        throw new Error(`Failed to create contact: ${createResponse.status}`)
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
      } else {
        const errorData = await tagResponse.text()
        console.error('Tag contact error:', errorData)
        throw new Error(`Failed to tag contact: ${tagResponse.status}`)
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'MindDump GHL test completed successfully',
      contactId,
      operationType,
      email: email.toLowerCase().trim()
    })
    
  } catch (error) {
    console.error('🧪 MindDump GHL test error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false 
    }, { status: 500 })
  }
}