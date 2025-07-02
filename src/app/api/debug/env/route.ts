import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasGhlApiKey: !!process.env.GHL_API_KEY,
    ghlApiKeyLength: process.env.GHL_API_KEY?.length || 0,
    hasGhlLocationId: !!process.env.GHL_LOCATION_ID,
    ghlLocationId: process.env.GHL_LOCATION_ID || 'not set',
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  })
}