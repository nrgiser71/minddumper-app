import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasStripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
    stripeSecretKeyLength: process.env.STRIPE_SECRET_KEY?.length || 0,
    stripeSecretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10) || 'none',
    hasPriceId: !!process.env.STRIPE_PRICE_ID,
    priceId: process.env.STRIPE_PRICE_ID || 'none',
    hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    webhookSecretLength: process.env.STRIPE_WEBHOOK_SECRET?.length || 0
  })
}