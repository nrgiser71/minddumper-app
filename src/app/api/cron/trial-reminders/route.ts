import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendTrialReminderEmail, sendTrialExpiredEmail } from '@/lib/mailgun';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    console.log('🕐 Trial reminders cron job started at:', new Date().toISOString());
    
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('❌ Unauthorized cron request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const now = new Date();
    const results = {
      threeDayReminders: 0,
      oneDayReminders: 0,
      expiredReminders: 0,
      errors: [] as string[]
    };
    
    // 1. Check for 3-day reminders (trial expires in ~3 days)
    console.log('🔍 Checking for 3-day reminders...');
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    threeDaysFromNow.setHours(0, 0, 0, 0); // Start of day
    
    const threeDaysEnd = new Date(threeDaysFromNow);
    threeDaysEnd.setHours(23, 59, 59, 999); // End of day
    
    const { data: threeDayUsers, error: threeDayError } = await supabase
      .from('profiles')
      .select('id, email, full_name, trial_expires_at')
      .eq('payment_status', 'trial')
      .eq('trial_reminder_sent_3day', false)
      .gte('trial_expires_at', threeDaysFromNow.toISOString())
      .lte('trial_expires_at', threeDaysEnd.toISOString());
    
    if (threeDayError) {
      console.error('❌ Error fetching 3-day reminder users:', threeDayError);
      results.errors.push(`3-day query error: ${threeDayError.message}`);
    } else if (threeDayUsers?.length > 0) {
      console.log(`📧 Found ${threeDayUsers.length} users for 3-day reminders`);
      
      for (const user of threeDayUsers) {
        try {
          await sendTrialReminderEmail(user.email, user.full_name || 'daar', 3);
          
          // Mark reminder as sent
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ trial_reminder_sent_3day: true })
            .eq('id', user.id);
          
          if (updateError) {
            console.error(`❌ Error updating 3-day reminder flag for ${user.email}:`, updateError);
            results.errors.push(`3-day flag update error for ${user.email}: ${updateError.message}`);
          } else {
            console.log(`✅ 3-day reminder sent to ${user.email}`);
            results.threeDayReminders++;
          }
        } catch (emailError) {
          console.error(`❌ Error sending 3-day reminder to ${user.email}:`, emailError);
          results.errors.push(`3-day email error for ${user.email}: ${emailError.message}`);
        }
      }
    } else {
      console.log('ℹ️ No users found for 3-day reminders');
    }
    
    // 2. Check for 1-day reminders (trial expires in ~1 day)
    console.log('🔍 Checking for 1-day reminders...');
    const oneDayFromNow = new Date(now);
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);
    oneDayFromNow.setHours(0, 0, 0, 0); // Start of day
    
    const oneDayEnd = new Date(oneDayFromNow);
    oneDayEnd.setHours(23, 59, 59, 999); // End of day
    
    const { data: oneDayUsers, error: oneDayError } = await supabase
      .from('profiles')
      .select('id, email, full_name, trial_expires_at')
      .eq('payment_status', 'trial')
      .eq('trial_reminder_sent_1day', false)
      .gte('trial_expires_at', oneDayFromNow.toISOString())
      .lte('trial_expires_at', oneDayEnd.toISOString());
    
    if (oneDayError) {
      console.error('❌ Error fetching 1-day reminder users:', oneDayError);
      results.errors.push(`1-day query error: ${oneDayError.message}`);
    } else if (oneDayUsers?.length > 0) {
      console.log(`📧 Found ${oneDayUsers.length} users for 1-day reminders`);
      
      for (const user of oneDayUsers) {
        try {
          await sendTrialReminderEmail(user.email, user.full_name || 'daar', 1);
          
          // Mark reminder as sent
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ trial_reminder_sent_1day: true })
            .eq('id', user.id);
          
          if (updateError) {
            console.error(`❌ Error updating 1-day reminder flag for ${user.email}:`, updateError);
            results.errors.push(`1-day flag update error for ${user.email}: ${updateError.message}`);
          } else {
            console.log(`✅ 1-day reminder sent to ${user.email}`);
            results.oneDayReminders++;
          }
        } catch (emailError) {
          console.error(`❌ Error sending 1-day reminder to ${user.email}:`, emailError);
          results.errors.push(`1-day email error for ${user.email}: ${emailError.message}`);
        }
      }
    } else {
      console.log('ℹ️ No users found for 1-day reminders');
    }
    
    // 3. Check for expired trials (trial expired, no expired email sent yet)
    console.log('🔍 Checking for expired trial notifications...');
    const { data: expiredUsers, error: expiredError } = await supabase
      .from('profiles')
      .select('id, email, full_name, trial_expires_at')
      .eq('payment_status', 'trial')
      .eq('trial_reminder_sent_expired', false)
      .lt('trial_expires_at', now.toISOString());
    
    if (expiredError) {
      console.error('❌ Error fetching expired trial users:', expiredError);
      results.errors.push(`Expired query error: ${expiredError.message}`);
    } else if (expiredUsers?.length > 0) {
      console.log(`📧 Found ${expiredUsers.length} users with expired trials`);
      
      for (const user of expiredUsers) {
        try {
          await sendTrialExpiredEmail(user.email, user.full_name || 'daar');
          
          // Mark expired email as sent
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ trial_reminder_sent_expired: true })
            .eq('id', user.id);
          
          if (updateError) {
            console.error(`❌ Error updating expired reminder flag for ${user.email}:`, updateError);
            results.errors.push(`Expired flag update error for ${user.email}: ${updateError.message}`);
          } else {
            console.log(`✅ Expired trial notification sent to ${user.email}`);
            results.expiredReminders++;
          }
        } catch (emailError) {
          console.error(`❌ Error sending expired notification to ${user.email}:`, emailError);
          results.errors.push(`Expired email error for ${user.email}: ${emailError.message}`);
        }
      }
    } else {
      console.log('ℹ️ No expired trial users found');
    }
    
    const totalProcessed = results.threeDayReminders + results.oneDayReminders + results.expiredReminders;
    
    console.log('📊 Trial reminders cron job completed:', {
      totalProcessed,
      threeDayReminders: results.threeDayReminders,
      oneDayReminders: results.oneDayReminders,
      expiredReminders: results.expiredReminders,
      errorCount: results.errors.length,
      completedAt: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      message: `Processed ${totalProcessed} trial reminders`,
      results: {
        processed: totalProcessed,
        threeDayReminders: results.threeDayReminders,
        oneDayReminders: results.oneDayReminders,
        expiredReminders: results.expiredReminders,
        errors: results.errors
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 Trial reminders cron job error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Handle POST requests as well (for manual triggers)
export async function POST(request: NextRequest) {
  console.log('🔄 Manual trial reminders trigger via POST');
  return GET(request);
}