import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'Auth API test endpoint working',
    timestamp: new Date().toISOString()
  })
}