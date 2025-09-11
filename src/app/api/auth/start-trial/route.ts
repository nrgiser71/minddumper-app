import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendTrialWelcomeEmail } from '@/lib/mailgun';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, fullName } = await request.json();
    
    console.log('🚀 Starting trial signup process for:', email);
    
    // Input validation
    if (!email || !fullName) {
      console.error('❌ Missing required fields');
      return NextResponse.json({ 
        error: 'Email en naam zijn verplicht' 
      }, { status: 400 });
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format:', email);
      return NextResponse.json({ 
        error: 'Ongeldig email adres' 
      }, { status: 400 });
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    const trimmedName = fullName.trim();
    
    // Check for existing accounts
    console.log('🔍 Checking for existing accounts...');
    
    // Check profiles table first
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('id, email, payment_status, is_trial_user, trial_expires_at')
      .eq('email', normalizedEmail)
      .single();
    
    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      console.error('❌ Error checking profiles:', profileCheckError);
      return NextResponse.json({ 
        error: 'Database fout bij account controle' 
      }, { status: 500 });
    }
    
    if (existingProfile) {
      console.log('👤 Found existing profile:', existingProfile.payment_status);
      
      if (existingProfile.payment_status === 'paid') {
        return NextResponse.json({ 
          error: 'Je hebt al een betaald MindDumper account. Log gewoon in!' 
        }, { status: 400 });
      }
      
      if (existingProfile.payment_status === 'trial') {
        // Check if trial is still active
        if (existingProfile.trial_expires_at) {
          const trialExpiry = new Date(existingProfile.trial_expires_at);
          if (trialExpiry > new Date()) {
            return NextResponse.json({ 
              error: 'Je hebt al een actieve trial. Check je email voor de inloglink!' 
            }, { status: 400 });
          } else {
            return NextResponse.json({ 
              error: 'Je trial is verlopen. Ga naar de upgrade pagina om MindDumper te kopen.' 
            }, { status: 400 });
          }
        }
      }
      
      // If existing profile is pending/failed/refunded, we can create new trial
      console.log('♻️ Existing account can be converted to trial');
    }
    
    // Check auth users as well to prevent duplicates
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      console.error('❌ Error checking auth users:', authError);
      return NextResponse.json({ 
        error: 'Database fout bij gebruikers controle' 
      }, { status: 500 });
    }
    
    const existingAuthUser = authUsers.users.find(user => user.email?.toLowerCase() === normalizedEmail);
    
    if (existingAuthUser && !existingProfile) {
      // Auth user exists but no profile - this is an inconsistent state
      console.error('⚠️ Inconsistent state: auth user exists but no profile');
      return NextResponse.json({ 
        error: 'Account bestaat al. Probeer in te loggen of neem contact op met support.' 
      }, { status: 400 });
    }
    
    // Calculate trial expiry (14 days from now)
    const trialExpiresAt = new Date();
    trialExpiresAt.setDate(trialExpiresAt.getDate() + 14);
    trialExpiresAt.setHours(23, 59, 59, 999); // End of day
    
    let userId: string;
    let isNewUser = true;
    
    if (existingProfile && existingAuthUser) {
      // Convert existing user to trial
      console.log('🔄 Converting existing user to trial');
      userId = existingProfile.id;
      isNewUser = false;
      
      // Update existing profile to trial status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: trimmedName, // Update name in case it changed
          payment_status: 'trial',
          is_trial_user: true,
          trial_expires_at: trialExpiresAt.toISOString(),
          // Reset reminder flags
          trial_reminder_sent_3day: false,
          trial_reminder_sent_1day: false,
          trial_reminder_sent_expired: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (updateError) {
        console.error('❌ Error updating existing profile to trial:', updateError);
        return NextResponse.json({ 
          error: 'Fout bij het activeren van trial' 
        }, { status: 500 });
      }
      
    } else {
      // Create completely new user
      console.log('👤 Creating new trial user');
      
      // Generate secure temporary password
      const tempPassword = crypto.randomUUID() + Math.random().toString(36).substring(2);
      
      // Create auth user
      const { data: authData, error: createAuthError } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password: tempPassword,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: trimmedName,
          source: 'trial_signup'
        }
      });
      
      if (createAuthError || !authData.user) {
        console.error('❌ Error creating auth user:', createAuthError);
        return NextResponse.json({ 
          error: 'Fout bij het aanmaken van account' 
        }, { status: 500 });
      }
      
      userId = authData.user.id;
      console.log('✅ Auth user created:', userId);
      
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: normalizedEmail,
          full_name: trimmedName,
          payment_status: 'trial',
          is_trial_user: true,
          trial_expires_at: trialExpiresAt.toISOString(),
          // Reminder flags start as false
          trial_reminder_sent_3day: false,
          trial_reminder_sent_1day: false,
          trial_reminder_sent_expired: false,
          language: 'nl', // Default language
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });
      
      if (profileError) {
        console.error('❌ Error creating profile:', profileError);
        // Cleanup: delete auth user if profile creation failed
        try {
          await supabase.auth.admin.deleteUser(userId);
        } catch (cleanupError) {
          console.error('❌ Error cleaning up auth user:', cleanupError);
        }
        return NextResponse.json({ 
          error: 'Fout bij het aanmaken van profiel' 
        }, { status: 500 });
      }
    }
    
    console.log(`✅ Trial ${isNewUser ? 'created' : 'updated'} for user:`, userId);
    
    // Send welcome email
    console.log('📧 Sending welcome email...');
    try {
      await sendTrialWelcomeEmail(normalizedEmail, trimmedName, trialExpiresAt);
      console.log('✅ Welcome email sent successfully');
    } catch (emailError) {
      console.error('⚠️ Welcome email failed, but trial is created:', emailError);
      // Don't fail the entire request if email fails
    }
    
    // Generate magic link for auto-login
    console.log('🔗 Generating magic login link...');
    try {
      const { data: magicLinkData, error: magicError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: normalizedEmail,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?redirect_to=/app`
        }
      });
      
      if (magicError) {
        console.error('⚠️ Magic link generation failed:', magicError);
      } else if (magicLinkData?.properties?.action_link) {
        console.log('✅ Magic link generated successfully');
        return NextResponse.json({
          success: true,
          message: 'Trial account aangemaakt! Je wordt doorgestuurd...',
          loginUrl: magicLinkData.properties.action_link,
          trialExpiresAt: trialExpiresAt.toISOString(),
          isNewUser
        });
      }
    } catch (linkError) {
      console.error('⚠️ Magic link error:', linkError);
    }
    
    // Fallback: return success without magic link
    console.log('✅ Trial created successfully (no magic link)');
    return NextResponse.json({
      success: true,
      message: 'Trial account aangemaakt! Check je email voor de inloglink.',
      trialExpiresAt: trialExpiresAt.toISOString(),
      isNewUser,
      fallbackLogin: true
    });
    
  } catch (error) {
    console.error('💥 Trial signup error:', error);
    return NextResponse.json({ 
      error: 'Er ging iets mis. Probeer het opnieuw.' 
    }, { status: 500 });
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ 
    message: 'Trial signup endpoint',
    status: 'active',
    method: 'POST only'
  });
}