import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { email, customerType, companyName, vatNumber, newsletter } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Get test price ID
    const testPriceId = process.env.STRIPE_TEST_PRICE_ID
    if (!testPriceId) {
      return NextResponse.json(
        { error: 'Test price ID not configured' },
        { status: 500 }
      )
    }

    // Create or get Stripe customer
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    })

    let customer
    if (customers.data.length > 0) {
      customer = customers.data[0]
    } else {
      customer = await stripe.customers.create({
        email,
        name: companyName || undefined,
        metadata: {
          customerType,
          companyName: companyName || '',
          vatNumber: vatNumber || '',
          newsletter: newsletter ? 'yes' : 'no',
          isTest: 'true', // Mark as test customer
        },
      })
    }

    // Create checkout session with TEST price
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: testPriceId, // Use €0.01 test price
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://minddumper.com'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://minddumper.com'}/test-checkout`,
      metadata: {
        email,
        customerType,
        companyName: companyName || '',
        vatNumber: vatNumber || '',
        newsletter: newsletter ? 'yes' : 'no',
        isTest: 'true', // Mark as test payment
      },
      billing_address_collection: 'required',
      locale: 'auto',
      allow_promotion_codes: false, // Disable for test
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe test checkout error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create test checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}