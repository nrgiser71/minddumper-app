import { NextResponse } from 'next/server';
import { mailgunClient } from '@/lib/mailgun';

export async function GET() {
  try {
    console.log('🧪 [MAILGUN TEST] Starting Mailgun API test...');
    
    // Test Mailgun configuration
    const config = {
      hasApiKey: !!process.env.MAILGUN_API_KEY,
      hasDomain: !!process.env.MAILGUN_DOMAIN,
      hasFromEmail: !!process.env.MAILGUN_FROM_EMAIL,
      hasFromName: !!process.env.MAILGUN_FROM_NAME,
      domain: process.env.MAILGUN_DOMAIN,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
      fromName: process.env.MAILGUN_FROM_NAME,
      clientInitialized: !!mailgunClient,
      apiKeyLength: process.env.MAILGUN_API_KEY ? process.env.MAILGUN_API_KEY.length : 0,
      apiKeyPrefix: process.env.MAILGUN_API_KEY ? process.env.MAILGUN_API_KEY.substring(0, 8) + '...' : 'NOT SET'
    };
    
    if (!mailgunClient) {
      return NextResponse.json({
        success: false,
        error: 'Mailgun client not initialized',
        config
      });
    }
    
    // Test sending a simple email
    console.log('🧪 [MAILGUN TEST] Attempting to send test email...');
    const testResult = await mailgunClient.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: `${process.env.MAILGUN_FROM_NAME} <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: ['hello@minddumper.com'], // Send to your own domain
      subject: 'MindDumper Mailgun Test - ' + new Date().toISOString(),
      text: 'This is a test email from the MindDumper staging environment to verify Mailgun connectivity.',
      html: `
        <h2>Mailgun Test Email</h2>
        <p>This is a test email from the MindDumper staging environment.</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <p><strong>Environment:</strong> ${process.env.VERCEL_ENV || 'unknown'}</p>
        <p>If you receive this email, Mailgun is working correctly!</p>
      `
    });
    
    console.log('🧪 [MAILGUN TEST] Email sent successfully:', testResult);
    
    return NextResponse.json({
      success: true,
      message: 'Mailgun test email sent successfully',
      config,
      mailgunResponse: {
        id: testResult.id,
        message: testResult.message
      }
    });
    
  } catch (error: unknown) {
    console.error('🧪 [MAILGUN TEST] Error:', error);
    
    let errorDetails = 'Unknown error';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorDetails = error.message;
      // Check for Mailgun API error
      if ('status' in error && typeof (error as { status?: number }).status === 'number') {
        statusCode = (error as { status: number }).status;
      }
    }
    
    return NextResponse.json({
      success: false,
      error: 'Mailgun test failed',
      details: errorDetails,
      config: {
        hasApiKey: !!process.env.MAILGUN_API_KEY,
        hasDomain: !!process.env.MAILGUN_DOMAIN,
        hasFromEmail: !!process.env.MAILGUN_FROM_EMAIL,
        domain: process.env.MAILGUN_DOMAIN,
        clientInitialized: !!mailgunClient
      }
    }, { status: statusCode });
  }
}