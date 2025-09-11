# PlugAndPay Payment Integration - Complete Setup Guide

## 📋 Overview
This guide provides a detailed step-by-step process for integrating PlugAndPay payment processing into a Next.js application with Supabase authentication. This setup includes automatic user creation, webhook handling, and auto-login functionality.

## 🎯 Prerequisites
- Next.js application with Supabase authentication
- PlugAndPay merchant account
- Domain with SSL certificate
- Access to DNS management

## 📝 Phase 1: PlugAndPay Account Setup

### Step 1.1: Create PlugAndPay Account
1. Go to https://plugandpay.nl/
2. Register for a merchant account
3. Complete verification process
4. Note down your API credentials

### Step 1.2: Configure Product in PlugAndPay Dashboard
1. Login to PlugAndPay dashboard
2. Navigate to Products section
3. Create new product:
   - **Product Name**: "Your App Lifetime Access"
   - **Price**: Set your price (e.g., €49.00)
   - **Currency**: EUR
   - **Type**: One-time payment
   - **Description**: Clear description of what customer gets

### Step 1.3: Setup Custom Domain (CRITICAL)
1. In PlugAndPay dashboard, go to Settings → Domains
2. Add custom domain: `pay.baasoverjetijd.be` (for MindDumper: was order.minddumper.com)
3. Configure DNS:
   ```
   CNAME pay.baasoverjetijd.be → plugandpay.nl
   ```
4. Wait for SSL certificate to be issued (can take up to 24 hours)
5. Test domain: `https://pay.baasoverjetijd.be` should show PlugAndPay page

### Step 1.4: Get API Keys
1. In PlugAndPay dashboard, go to API section
2. Copy your API key (format: XXXXX-XXXXX-XXXXX-XXXXX)
3. Save this key securely - you'll need it for webhook verification

## 📝 Phase 2: Database Schema Updates

### Step 2.1: Add Payment Fields to Supabase
Create and run this migration in Supabase SQL editor:

```sql
-- Add payment fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS amount_paid_cents INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plugandpay_order_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_payment_status ON profiles(payment_status);
CREATE INDEX IF NOT EXISTS idx_profiles_plugandpay_order_id ON profiles(plugandpay_order_id);
CREATE INDEX IF NOT EXISTS idx_profiles_paid_at ON profiles(paid_at);
```

### Step 2.2: Remove Old Stripe Fields (if applicable)
```sql
-- Remove Stripe-related columns if they exist
ALTER TABLE profiles DROP COLUMN IF EXISTS stripe_customer_id;
ALTER TABLE profiles DROP COLUMN IF EXISTS stripe_subscription_id;
ALTER TABLE profiles DROP COLUMN IF EXISTS stripe_price_id;
```

## 📝 Phase 3: Webhook Implementation

### Step 3.1: Create Webhook API Route
Create file: `/src/app/api/plugandpay/webhook/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PLUGANDPAY_API_KEY = process.env.PLUGANDPAY_API_KEY!

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Webhook received')
    
    // Get raw body for form-urlencoded data
    const body = await request.text()
    console.log('📥 Raw body:', body)
    
    // Parse form-urlencoded data
    const params = new URLSearchParams(body)
    const data: any = {}
    
    for (const [key, value] of params.entries()) {
      data[key] = value
    }
    
    console.log('📋 Parsed data:', data)
    
    // Verify API key
    const providedApiKey = data.api_key
    if (providedApiKey !== PLUGANDPAY_API_KEY) {
      console.error('❌ Invalid API key')
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }
    
    // Extract payment details
    const {
      event_type,
      order_id,
      email,
      amount_cents,
      status,
      product_name
    } = data
    
    console.log('💳 Payment details:', {
      event_type,
      order_id,
      email,
      amount_cents,
      status,
      product_name
    })
    
    // Only process successful payments
    if (event_type === 'payment.completed' && status === 'paid') {
      console.log('✅ Processing successful payment')
      
      // Create user in Supabase Auth
      const tempPassword = 'minddumper123' // Fixed password for auto-login
      
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: tempPassword,
        email_confirm: true
      })
      
      if (authError) {
        console.error('❌ Auth user creation failed:', authError)
        return NextResponse.json({ error: 'User creation failed' }, { status: 500 })
      }
      
      console.log('👤 User created in auth:', authData.user.id)
      
      // Update user profile with payment info
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          payment_status: 'paid',
          amount_paid_cents: parseInt(amount_cents),
          plugandpay_order_id: order_id,
          paid_at: new Date().toISOString()
        })
        .eq('id', authData.user.id)
      
      if (profileError) {
        console.error('❌ Profile update failed:', profileError)
        return NextResponse.json({ error: 'Profile update failed' }, { status: 500 })
      }
      
      console.log('✅ Payment processed successfully')
      
      return NextResponse.json({ 
        success: true, 
        message: 'Payment processed successfully',
        user_id: authData.user.id
      })
    }
    
    return NextResponse.json({ message: 'Event ignored' })
    
  } catch (error) {
    console.error('💥 Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Step 3.2: Create Latest User API Route
Create file: `/src/app/api/auth/latest-user/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    console.log('🔍 Fetching latest paid user...')
    
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, email, payment_status, paid_at')
      .eq('payment_status', 'paid')
      .order('paid_at', { ascending: false })
      .limit(1)
    
    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 })
    }
    
    if (!profiles || profiles.length === 0) {
      console.log('⚠️ No paid users found')
      return NextResponse.json({ success: false, message: 'No paid users found' }, { status: 404 })
    }
    
    const latestUser = profiles[0]
    console.log('✅ Latest user found:', latestUser.email)
    
    return NextResponse.json({
      success: true,
      user: {
        id: latestUser.id,
        email: latestUser.email,
        payment_status: latestUser.payment_status,
        paid_at: latestUser.paid_at
      }
    })
    
  } catch (error) {
    console.error('💥 API error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
```

## 📝 Phase 4: Frontend Implementation

### Step 4.1: Create Welcome Page
Create file: `/src/app/welcome/page.tsx`

```typescript
'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

function WelcomeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'logging_in' | 'success' | 'error'>('logging_in')
  const [userEmail, setUserEmail] = useState('')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const attemptAutoLogin = async () => {
      try {
        console.log('🔄 Attempting auto-login...')
        
        // Get the latest user's email from the API
        const response = await fetch('/api/auth/latest-user')
        const result = await response.json()
        
        if (!response.ok || !result.success) {
          console.error('❌ Failed to get latest user:', result.message)
          setStatus('error')
          return
        }
        
        const latestUserEmail = result.user.email
        setUserEmail(latestUserEmail)
        const tempPassword = 'minddumper123' // Same as in webhook
        
        console.log('📧 Using email for auto-login:', latestUserEmail)
        
        const { error } = await supabase.auth.signInWithPassword({
          email: latestUserEmail,
          password: tempPassword,
        })

        if (error) {
          console.error('❌ Auto-login failed:', error)
          setStatus('error')
        } else {
          console.log('✅ Auto-login successful!')
          setStatus('success')
          
          // Redirect to password reset after 3 seconds
          setTimeout(() => {
            router.push('/auth/reset-password?welcome=true')
          }, 3000)
        }
      } catch (error) {
        console.error('💥 Auto-login error:', error)
        setStatus('error')
      }
    }

    attemptAutoLogin()
  }, [router, supabase, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl" style={{ padding: '48px' }}>
        {/* Logo and branding */}
        <div className="flex justify-center" style={{ marginBottom: '32px' }}>
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-gray-900">Your App Name</h2>
              <p className="text-sm text-gray-500">Your tagline</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          {status === 'logging_in' && (
            <>
              <div style={{ marginBottom: '32px' }}>
                <div className="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ marginBottom: '24px' }}>
                Setting up your account...
              </h1>
              
              <p className="text-lg text-gray-600" style={{ marginBottom: '32px' }}>
                We're logging you in automatically. This will take just a moment.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{ marginBottom: '32px' }}>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ marginBottom: '24px' }}>
                Welcome!
              </h1>
              
              <p className="text-lg text-gray-600" style={{ marginBottom: '32px' }}>
                Thank you for purchasing Your App Name. Your account has been created successfully.
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ marginBottom: '24px' }}>
                Welcome!
              </h1>
              
              <p className="text-lg text-gray-600" style={{ marginBottom: '32px' }}>
                Thank you for purchasing Your App Name. Please use the manual login below.
              </p>

              <div className="space-y-4">
                <Link 
                  href="/auth/login" 
                  className="block w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Go to Login
                </Link>
                
                <p className="text-sm text-gray-500">
                  Email: {userEmail} | Password: minddumper123
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WelcomeContent />
    </Suspense>
  )
}
```

### Step 4.2: Update Payment Buttons
Update all payment buttons in your app to point to PlugAndPay:

```typescript
// Replace Stripe checkout buttons with PlugAndPay
const handlePayment = () => {
  window.location.href = 'https://pay.baasoverjetijd.be/checkout/minddumper'
}

// In your component
<button 
  onClick={handlePayment}
  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
>
  Purchase Now - €49
</button>
```

## 📝 Phase 5: Environment Variables

### Step 5.1: Add to .env.local
```env
# PlugAndPay
PLUGANDPAY_API_KEY=YOUR-API-KEY-HERE

# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 5.2: Add to Vercel Environment Variables
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the PLUGANDPAY_API_KEY variable

## 📝 Phase 6: PlugAndPay Webhook Configuration

### Step 6.1: Setup Webhook in PlugAndPay Dashboard
1. Login to PlugAndPay dashboard
2. Go to Webhooks section
3. Click "Add Webhook"
4. Configure webhook:
   - **URL**: `https://minddumper.com/api/plugandpay/webhook`
   - **Events**: Select "Payment Completed" (NOT invoice events)
   - **Method**: POST
   - **Format**: form-urlencoded (NOT JSON)
   - **API Key**: Your API key (for verification)

### Step 6.2: Test Webhook
1. Make a test payment through PlugAndPay
2. Check your application logs for webhook activity
3. Verify user is created in Supabase
4. Test the welcome page auto-login flow

## 📝 Phase 7: Success Page Configuration

### Step 7.1: Update PlugAndPay Success Redirect
In PlugAndPay dashboard, set success redirect URL to:
```
https://minddumper.com/welcome
```

### Step 7.2: Test Complete Flow
1. Make a test payment
2. Verify redirect to welcome page
3. Test auto-login functionality
4. Verify redirect to password reset
5. Test password change flow

## 🔧 Troubleshooting

### Common Issues

#### 1. Webhook Not Receiving Data
**Problem**: Webhook receives empty body
**Solution**: 
- Ensure webhook is configured for "Payment Completed" events
- Use form-urlencoded format, NOT JSON
- Check that the correct product webhook is configured

#### 2. Auto-Login Fails
**Problem**: User cannot be logged in automatically
**Solution**:
- Verify the same password is used in webhook and welcome page
- Check that user was created successfully in Supabase
- Ensure email matches exactly

#### 3. CORS Errors
**Problem**: Frontend cannot call API routes
**Solution**:
- Ensure API routes are in the correct Next.js structure
- Check that environment variables are set correctly

#### 4. Database Errors
**Problem**: Cannot update user profile
**Solution**:
- Verify database schema has all required columns
- Check that service role key has correct permissions
- Ensure user ID exists in profiles table

### Debug Commands

```bash
# Check webhook logs
vercel logs --app=your-app-name

# Test webhook locally
curl -X POST http://localhost:3000/api/plugandpay/webhook \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "api_key=YOUR-API-KEY&event_type=payment.completed&status=paid&email=test@example.com&order_id=test123&amount_cents=4900"

# Test latest user API
curl http://localhost:3000/api/auth/latest-user
```

## 📋 Checklist

Before going live, verify all of these:

### PlugAndPay Setup
- [ ] Product created and configured
- [ ] Custom domain configured and SSL working
- [ ] Webhook configured for correct events
- [ ] API key saved and working
- [ ] Success redirect URL set to welcome page

### Database
- [ ] Payment fields added to profiles table
- [ ] Old Stripe fields removed (if applicable)
- [ ] Indexes created for performance
- [ ] Service role key has correct permissions

### Code Implementation
- [ ] Webhook route handles form-urlencoded data
- [ ] API key verification working
- [ ] User creation in Supabase auth working
- [ ] Profile update with payment info working
- [ ] Latest user API route working
- [ ] Welcome page auto-login working
- [ ] Password reset flow working

### Frontend
- [ ] Payment buttons point to PlugAndPay
- [ ] Welcome page displays correctly
- [ ] Auto-login functionality working
- [ ] Error states handled properly
- [ ] Success flow redirects correctly

### Environment
- [ ] All environment variables set
- [ ] Variables added to production (Vercel)
- [ ] API keys are correct and active

### Testing
- [ ] Test payment completed successfully
- [ ] Webhook receives and processes data
- [ ] User created in database
- [ ] Auto-login works
- [ ] Password reset works
- [ ] End-to-end flow complete

## 🚀 Go Live

1. Deploy all code changes to production
2. Update PlugAndPay webhook URL to production
3. Test with real payment (small amount)
4. Monitor logs for any issues
5. Update documentation with final URLs

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all checklist items are completed
3. Review logs for specific error messages
4. Test each component individually
5. Contact PlugAndPay support if webhook issues persist

---

**Note**: This guide documents the actual MindDumper implementation. Domain changed from order.minddumper.com to pay.baasoverjetijd.be to resolve PlugAndPay account conflicts.