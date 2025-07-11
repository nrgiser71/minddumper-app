import { NextRequest, NextResponse } from 'next/server'
import { stripe, getStripePriceId } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { email, customerType, companyName, vatNumber, newsletter } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
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
        },
      })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card', 'ideal', 'bancontact'],
      mode: 'payment',
      line_items: [
        {
          price: getStripePriceId(),
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://minddumper.com'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://minddumper.com'}/checkout`,
      metadata: {
        email,
        customerType,
        companyName: companyName || '',
        vatNumber: vatNumber || '',
        newsletter: newsletter ? 'yes' : 'no',
      },
      billing_address_collection: 'required',
      locale: 'auto',
      allow_promotion_codes: true,
      tax_id_collection: {
        enabled: customerType === 'business',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error',
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
        hasPriceId: !!process.env.STRIPE_PRICE_ID
      },
      { status: 500 }
    )
  }
}