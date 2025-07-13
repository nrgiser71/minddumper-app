import { NextRequest, NextResponse } from 'next/server'

// Test endpoint to simulate PlugAndPay webhook
// This helps us understand the webhook payload structure

export async function POST(request: NextRequest) {
  try {
    // Log all headers
    const headers: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      headers[key] = value
    })
    
    console.log('📋 Test webhook headers:', JSON.stringify(headers, null, 2))
    
    // Get the raw body
    const body = await request.json()
    console.log('📦 Test webhook body:', JSON.stringify(body, null, 2))
    
    // Simulate calling the real webhook
    const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://minddumper.com'}/api/plugandpay/webhook`
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.PLUGANDPAY_API_KEY || 'XEN9Q-8GHMY-TPRL2-4WSA6'
      },
      body: JSON.stringify({
        event: 'order.paid',
        order_id: 'TEST-' + Date.now(),
        customer_email: body.email || 'test@example.com',
        customer_name: body.name || 'Test User',
        amount: 49,
        currency: 'EUR',
        status: 'paid',
        product_name: 'MindDumper Lifetime Access'
      })
    })
    
    const result = await response.json()
    
    return NextResponse.json({
      message: 'Test webhook processed',
      webhook_response: result,
      headers_received: headers,
      body_received: body
    })
    
  } catch (error) {
    console.error('Test webhook error:', error)
    return NextResponse.json({ 
      error: 'Test failed',
      message: (error as Error).message 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'PlugAndPay test webhook endpoint',
    usage: 'POST to this endpoint to test the webhook',
    test_payload: {
      email: 'test@example.com',
      name: 'Test User'
    }
  })
}