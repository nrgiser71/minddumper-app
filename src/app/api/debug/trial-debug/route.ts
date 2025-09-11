import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Test Mailgun configuration
    const mailgunConfig = {
      hasApiKey: !!process.env.MAILGUN_API_KEY,
      hasDomain: !!process.env.MAILGUN_DOMAIN,
      hasFromEmail: !!process.env.MAILGUN_FROM_EMAIL,
      hasFromName: !!process.env.MAILGUN_FROM_NAME,
      domain: process.env.MAILGUN_DOMAIN || 'NOT SET',
      fromEmail: process.env.MAILGUN_FROM_EMAIL || 'NOT SET',
      fromName: process.env.MAILGUN_FROM_NAME || 'NOT SET',
      apiKeyLength: process.env.MAILGUN_API_KEY ? process.env.MAILGUN_API_KEY.length : 0
    };

    // Test URL configuration
    const urlConfig = {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL
    };

    // Test Supabase connection
    let supabaseTest = { connected: false, error: null };
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      supabaseTest = { connected: !error, error: error?.message || null };
    } catch (err: any) {
      supabaseTest = { connected: false, error: err.message };
    }

    // Generate test redirect URL
    const testRedirectUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || 'https://minddumper-app-git-staging-nrgiser71s-projects.vercel.app').replace(/\/$/, '')}/auth/callback?redirect_to=/app`;

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      mailgun: mailgunConfig,
      urls: urlConfig,
      supabase: supabaseTest,
      testRedirectUrl,
      recommendations: [
        mailgunConfig.hasApiKey ? '✅ Mailgun API key found' : '❌ Mailgun API key missing',
        mailgunConfig.hasDomain ? '✅ Mailgun domain found' : '❌ Mailgun domain missing',
        mailgunConfig.hasFromEmail ? '✅ Mailgun from email found' : '❌ Mailgun from email missing',
        urlConfig.NEXT_PUBLIC_SITE_URL !== 'NOT SET' ? '✅ Site URL configured' : '❌ Site URL not configured',
        supabaseTest.connected ? '✅ Supabase connected' : `❌ Supabase error: ${supabaseTest.error}`
      ]
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Debug endpoint failed',
      details: error.message
    }, { status: 500 });
  }
}