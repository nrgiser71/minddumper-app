import { NextResponse } from 'next/server';

// Import the trial reminder cron job logic
export async function GET() {
  try {
    console.log('🧪 [TRIAL CRON TEST] Starting manual trial cron job test...');
    
    // Import and execute the cron job logic
    const cronModule = await import('../../cron/trial-reminders/route');
    const result = await cronModule.GET();
    
    // Parse the result if it's a Response object
    let cronResult;
    if (result instanceof Response) {
      cronResult = await result.json();
    } else {
      cronResult = result;
    }
    
    console.log('🧪 [TRIAL CRON TEST] Cron job completed:', cronResult);
    
    return NextResponse.json({
      success: true,
      message: 'Trial cron job executed successfully',
      timestamp: new Date().toISOString(),
      cronResult
    });
    
  } catch (error: unknown) {
    console.error('🧪 [TRIAL CRON TEST] Error running cron job:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to run trial cron job',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}