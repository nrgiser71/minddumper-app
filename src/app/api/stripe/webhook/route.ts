import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Disable body parsing, need raw body for webhook signature verification
export const dynamic = 'force-dynamic'

async function buffer(readable: ReadableStream<Uint8Array>) {
  const chunks = []
  const reader = readable.getReader()
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }
  
  return Buffer.concat(chunks)
}

export async function POST(req: NextRequest) {
  const body = await buffer(req.body!)
  const signature = req.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      // Get customer details
      const email = session.customer_email || session.customer_details?.email
      if (!email) {
        console.error('No email found in session')
        return NextResponse.json({ error: 'No email found' }, { status: 400 })
      }

      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)

      // Create or get existing user in Supabase Auth
      console.log('Creating user with email:', email)
      let userId

      const { data: createData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
      })

      if (authError && authError.code === 'email_exists') {
        // User already exists, get the existing user with pagination
        console.log('User already exists, fetching existing user')
        
        // Use listUsers with pagination to find all users
        let foundUser = null
        let page = 1
        const perPage = 1000
        
        while (!foundUser) {
          const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers({
            page,
            perPage
          })
          
          if (listError) {
            console.error('Failed to list users:', listError)
            return NextResponse.json({ error: 'Failed to get existing user' }, { status: 500 })
          }

          console.log(`Searching page ${page}, found ${existingUsers.users.length} users`)
          foundUser = existingUsers.users.find(user => user.email === email)
          
          if (foundUser) {
            userId = foundUser.id
            console.log('Found existing user:', userId)
            break
          }
          
          // If we got less than perPage users, we've reached the end
          if (existingUsers.users.length < perPage) {
            console.error('User exists but not found in any page - email:', email)
            console.error('Total pages searched:', page)
            return NextResponse.json({ error: 'User exists but not accessible' }, { status: 500 })
          }
          
          page++
        }
      } else if (authError) {
        console.error('Failed to create user:', authError)
        return NextResponse.json({ 
          error: 'Failed to create user', 
          details: authError.message,
          email: email 
        }, { status: 500 })
      } else {
        // User created successfully
        userId = createData.user!.id
        console.log('User created successfully:', userId)
      }

      // Update the user's profile with payment information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          stripe_customer_id: session.customer as string,
          stripe_payment_intent_id: session.payment_intent as string,
          payment_status: 'completed',
          paid_at: new Date().toISOString(),
          amount_paid_cents: session.amount_total,
          currency: session.currency,
          customer_type: session.metadata?.customerType || 'private',
          company_name: session.metadata?.companyName || null,
          billing_address_line1: session.customer_details?.address?.line1 || null,
          billing_address_line2: session.customer_details?.address?.line2 || null,
          billing_city: session.customer_details?.address?.city || null,
          billing_postal_code: session.customer_details?.address?.postal_code || null,
          billing_country: session.customer_details?.address?.country || null,
          billing_state: session.customer_details?.address?.state || null,
          vat_number: session.metadata?.vatNumber || null,
          newsletter_opted_in: session.metadata?.newsletter === 'yes',
        })
        .eq('id', userId)

      if (profileError) {
        console.error('Failed to update profile:', profileError)
      }

      // Send welcome email with login instructions
      const { error: emailError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://minddumper.com'}/auth/reset-password`,
      })

      if (emailError) {
        console.error('Failed to send password reset email:', emailError)
      }

      console.log(`Successfully processed payment for ${email}`)
      return NextResponse.json({ received: true, status: 'success' })
    } catch (error) {
      console.error('Webhook processing error:', error)
      return NextResponse.json(
        { error: 'Failed to process webhook' },
        { status: 500 }
      )
    }
  }

  // Return a 200 response for other event types
  return NextResponse.json({ received: true })
}