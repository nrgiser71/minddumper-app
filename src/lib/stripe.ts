import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
  typescript: true,
})

// Pricing configuration
export const PRODUCT_PRICE = process.env.PRODUCT_PRICE_EUROS || '49'
export const PRODUCT_PRICE_CENTS = parseInt(process.env.PRODUCT_PRICE_CENTS || '4900')
export const PRODUCT_CURRENCY = process.env.PRODUCT_CURRENCY || 'eur'
export const PRODUCT_NAME = process.env.PRODUCT_NAME || 'MindDumper Lifetime Access'
export const PRODUCT_DESCRIPTION = process.env.PRODUCT_DESCRIPTION || 'Lifetime access to MindDumper - Brain dump tool with trigger words in 5 languages'

// Get the Price ID from environment or throw error
export function getStripePriceId(): string {
  const priceId = process.env.STRIPE_PRICE_ID
  if (!priceId) {
    throw new Error('STRIPE_PRICE_ID is not set in environment variables')
  }
  return priceId
}