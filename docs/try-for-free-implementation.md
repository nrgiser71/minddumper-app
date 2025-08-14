# Try For Free - Complete Implementation Guide

## Concept Overview
Email-based 24-hour trial system that is completely isolated from the main paid application. Users fill out a form, receive an email with a unique trial link, and get 24 hours of access starting from first use.

## Key Design Decisions
- **Zero impact on existing users** - Completely separate code path
- **No database pollution** - Only one new table, no writes to existing tables  
- **Email-based access** - Unique tokens sent via Mailgun
- **Limited functionality** - No history, no custom words, no preferences saving
- **24 hours from first use** - Not from email send

## Implementation Steps

### 1. Database Setup (1 hour)

#### New Table
```sql
-- Add to new migration file: supabase/migrations/add_trial_system.sql
CREATE TABLE public.trial_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  normalized_email TEXT NOT NULL UNIQUE, -- For anti-abuse
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  first_used_at TIMESTAMP WITH TIME ZONE NULL,
  expires_at TIMESTAMP WITH TIME ZONE NULL, -- Set when first used
  is_expired BOOLEAN DEFAULT FALSE,
  ip_address TEXT, -- For future rate limiting if needed
  user_agent TEXT -- For basic fingerprinting
);

-- Indexes
CREATE INDEX idx_trial_requests_token ON public.trial_requests(token);
CREATE INDEX idx_trial_requests_normalized_email ON public.trial_requests(normalized_email);
CREATE INDEX idx_trial_requests_expires_at ON public.trial_requests(expires_at) WHERE expires_at IS NOT NULL;

-- RLS Policy (service role only)
ALTER TABLE public.trial_requests ENABLE ROW LEVEL SECURITY;

-- Only allow service role access (no user access needed)
CREATE POLICY "Service role only" ON public.trial_requests
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
```

### 2. Email Service Setup (1 hour)

#### Mailgun Configuration
```bash
# Environment variables to add to .env.local
MAILGUN_API_KEY=key-xxxxx
MAILGUN_DOMAIN=mg.yourdomain.com
MAILGUN_FROM_EMAIL=trial@minddumper.com
MAILGUN_FROM_NAME=MindDumper Trial
```

#### Email Utility Function
Create `src/lib/email.ts`:
```typescript
import formData from 'form-data'
import Mailgun from 'mailgun.js'

const mailgun = new Mailgun(formData)
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
})

export const sendTrialEmail = async (email: string, token: string) => {
  const trialUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/trial/${token}`
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your MindDumper Trial is Ready</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin: 0;">MindDumper</h1>
        <p style="color: #666; font-size: 18px; margin: 10px 0 0 0;">Your 24-hour trial is ready!</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #333; margin: 0 0 15px 0;">Start Your Free Trial</h2>
        <p style="color: #555; line-height: 1.5; margin: 0 0 20px 0;">
          Click the button below to start your 24-hour free trial of MindDumper. 
          Your trial time begins when you first click the link, so you can start whenever you're ready.
        </p>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${trialUrl}" 
             style="background: #007bff; color: white; text-decoration: none; padding: 15px 30px; border-radius: 5px; display: inline-block; font-weight: bold;">
            Start My Free Trial
          </a>
        </div>
        
        <p style="color: #777; font-size: 14px; margin: 20px 0 0 0;">
          This link is unique to you and expires after 24 hours of first use.
        </p>
      </div>
      
      <div style="margin: 30px 0; text-align: center;">
        <h3 style="color: #333; margin: 0 0 15px 0;">What you'll get:</h3>
        <ul style="text-align: left; color: #555; line-height: 1.6; max-width: 400px; margin: 0 auto;">
          <li>Complete brain dump session</li>
          <li>Multi-language trigger words</li>
          <li>Export your ideas to text or CSV</li>
          <li>24 hours of full access</li>
        </ul>
      </div>
      
      <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #777; font-size: 14px;">
        <p>Questions? Reply to this email or visit <a href="https://minddumper.com/contact">minddumper.com/contact</a></p>
        <p style="margin: 10px 0 0 0;">MindDumper - Clear your mind of all tasks</p>
      </div>
    </body>
    </html>
  `

  const textContent = `
Your MindDumper Trial is Ready!

Click this link to start your 24-hour free trial:
${trialUrl}

Your trial time begins when you first click the link, so you can start whenever you're ready.

What you'll get:
- Complete brain dump session
- Multi-language trigger words  
- Export your ideas to text or CSV
- 24 hours of full access

Questions? Reply to this email or visit minddumper.com/contact

MindDumper - Clear your mind of all tasks
  `

  return mg.messages.create(process.env.MAILGUN_DOMAIN!, {
    from: `${process.env.MAILGUN_FROM_NAME} <${process.env.MAILGUN_FROM_EMAIL}>`,
    to: [email],
    subject: 'Your MindDumper 24-Hour Trial is Ready',
    text: textContent,
    html: htmlContent,
  })
}
```

### 3. Backend API Endpoints (3 hours)

#### Email Normalization Utility
Create `src/lib/email-utils.ts`:
```typescript
// Known disposable email domains
const DISPOSABLE_DOMAINS = [
  '10minutemail.com', 'guerrillamail.com', 'tempmail.org', 
  'yopmail.com', 'throwaway.email', 'mailinator.com'
  // Add more as needed
]

export const normalizeEmail = (email: string): string => {
  const lowercaseEmail = email.toLowerCase().trim()
  
  // Handle Gmail+ and dot tricks
  if (lowercaseEmail.includes('@gmail.com')) {
    const [localPart, domain] = lowercaseEmail.split('@')
    // Remove everything after + and remove dots
    const cleanLocal = localPart.split('+')[0].replace(/\./g, '')
    return `${cleanLocal}@${domain}`
  }
  
  return lowercaseEmail
}

export const isDisposableEmail = (email: string): boolean => {
  const domain = email.toLowerCase().split('@')[1]
  return DISPOSABLE_DOMAINS.includes(domain)
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
```

#### Trial Request API
Create `src/app/api/trial/request/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendTrialEmail } from '@/lib/email'
import { normalizeEmail, isDisposableEmail, isValidEmail } from '@/lib/email-utils'
import { randomBytes } from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Basic validation
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    // Check for disposable email
    if (isDisposableEmail(email)) {
      return NextResponse.json(
        { error: 'Temporary email addresses are not allowed' },
        { status: 400 }
      )
    }

    const normalizedEmail = normalizeEmail(email)

    // Check if trial already requested for this normalized email
    const { data: existingTrial } = await supabase
      .from('trial_requests')
      .select('id, created_at, is_expired')
      .eq('normalized_email', normalizedEmail)
      .single()

    if (existingTrial) {
      // If trial exists and not expired, don't create new one
      if (!existingTrial.is_expired) {
        return NextResponse.json(
          { error: 'A trial has already been requested for this email address' },
          { status: 409 }
        )
      }
    }

    // Generate secure random token
    const token = randomBytes(32).toString('hex')

    // Get client IP and user agent
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create trial request
    const { error: insertError } = await supabase
      .from('trial_requests')
      .insert({
        email,
        normalized_email: normalizedEmail,
        token,
        ip_address: ip,
        user_agent: userAgent,
      })

    if (insertError) {
      console.error('Database insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create trial request' },
        { status: 500 }
      )
    }

    // Send email
    try {
      await sendTrialEmail(email, token)
    } catch (emailError) {
      console.error('Email send error:', emailError)
      // Don't expose email error to user, but log it
      return NextResponse.json(
        { error: 'Failed to send trial email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Trial email sent! Check your inbox.'
    })

  } catch (error) {
    console.error('Trial request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

#### Trial Validation API
Create `src/app/api/trial/validate/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Get trial request
    const { data: trial, error } = await supabase
      .from('trial_requests')
      .select('*')
      .eq('token', token)
      .single()

    if (error || !trial) {
      return NextResponse.json(
        { error: 'Invalid trial token' },
        { status: 404 }
      )
    }

    const now = new Date()

    // Check if already expired
    if (trial.is_expired || (trial.expires_at && new Date(trial.expires_at) < now)) {
      return NextResponse.json(
        { error: 'Trial has expired' },
        { status: 410 }
      )
    }

    // If first use, set expiration time
    if (!trial.first_used_at) {
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now

      const { error: updateError } = await supabase
        .from('trial_requests')
        .update({
          first_used_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .eq('token', token)

      if (updateError) {
        console.error('Failed to update trial first use:', updateError)
        return NextResponse.json(
          { error: 'Failed to activate trial' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        valid: true,
        timeRemaining: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        email: trial.email,
        isFirstUse: true
      })
    }

    // Calculate remaining time
    const expiresAt = new Date(trial.expires_at)
    const timeRemaining = Math.max(0, expiresAt.getTime() - now.getTime())

    if (timeRemaining <= 0) {
      // Mark as expired
      await supabase
        .from('trial_requests')
        .update({ is_expired: true })
        .eq('token', token)

      return NextResponse.json(
        { error: 'Trial has expired' },
        { status: 410 }
      )
    }

    return NextResponse.json({
      valid: true,
      timeRemaining,
      email: trial.email,
      isFirstUse: false
    })

  } catch (error) {
    console.error('Trial validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 4. Frontend Components (8 hours)

#### Landing Page Trial Form
Update `src/components/HeroSection.tsx`:
```typescript
// Add this to the existing HeroSection component after line 26:

const [trialEmail, setTrialEmail] = useState('')
const [trialLoading, setTrialLoading] = useState(false)
const [trialSubmitted, setTrialSubmitted] = useState(false)
const [trialError, setTrialError] = useState('')

const handleTrialSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!trialEmail) {
    setTrialError('Please enter your email address')
    return
  }

  setTrialLoading(true)
  setTrialError('')

  try {
    const response = await fetch('/api/trial/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trialEmail }),
    })

    const result = await response.json()

    if (response.ok) {
      setTrialSubmitted(true)
    } else {
      setTrialError(result.error || 'Something went wrong. Please try again.')
    }
  } catch (error) {
    setTrialError('Network error. Please check your connection and try again.')
  } finally {
    setTrialLoading(false)
  }
}

// Add this after the existing button (around line 27):

{!trialSubmitted ? (
  <form onSubmit={handleTrialSubmit} className="trial-form">
    <div className="trial-input-group">
      <input
        type="email"
        placeholder="Enter your email for 24h free trial"
        value={trialEmail}
        onChange={(e) => setTrialEmail(e.target.value)}
        className="trial-email-input"
        disabled={trialLoading}
      />
      <button
        type="submit"
        disabled={trialLoading}
        className="btn-trial"
      >
        {trialLoading ? 'Sending...' : 'Try Free for 24h'}
      </button>
    </div>
    {trialError && (
      <p className="trial-error">{trialError}</p>
    )}
  </form>
) : (
  <div className="trial-success">
    <h3>Check your email!</h3>
    <p>We've sent your trial link to {trialEmail}</p>
    <p className="trial-success-note">Your 24-hour trial starts when you click the link.</p>
  </div>
)}
```

Add CSS to `src/app/landing.css`:
```css
.trial-form {
  margin-top: 20px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.trial-input-group {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.trial-email-input {
  flex: 1;
  padding: 15px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
}

.trial-email-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.btn-trial {
  padding: 15px 25px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}

.btn-trial:hover:not(:disabled) {
  background: #218838;
}

.btn-trial:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.trial-error {
  color: #dc3545;
  font-size: 14px;
  margin: 5px 0 0 0;
  text-align: center;
}

.trial-success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  margin-top: 20px;
}

.trial-success h3 {
  color: #155724;
  margin: 0 0 10px 0;
}

.trial-success p {
  color: #155724;
  margin: 5px 0;
}

.trial-success-note {
  font-size: 14px;
  opacity: 0.8;
}

@media (max-width: 600px) {
  .trial-input-group {
    flex-direction: column;
  }
  
  .trial-email-input,
  .btn-trial {
    width: 100%;
  }
}
```

#### Trial App Component
Create `src/app/trial/[token]/page.tsx`:
```typescript
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getTriggerWords } from '@/lib/database'
import type { TriggerWord } from '@/lib/supabase'
import '@/app/app.css' // Reuse existing styles

interface TrialData {
  valid: boolean
  timeRemaining: number
  email: string
  isFirstUse: boolean
}

type Language = 'nl' | 'en' | 'de' | 'fr' | 'es'

export default function TrialPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [trialData, setTrialData] = useState<TrialData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Brain dump state
  const [currentScreen, setCurrentScreen] = useState<'language' | 'minddump' | 'finish'>('language')
  const [currentLanguage, setCurrentLanguage] = useState<Language>('nl')
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentIdeas, setCurrentIdeas] = useState<string[]>([])
  const [allIdeas, setAllIdeas] = useState<string[]>([])
  const [ideaInput, setIdeaInput] = useState('')
  const [triggerWords, setTriggerWords] = useState<string[]>([])
  const [triggerWordsData, setTriggerWordsData] = useState<TriggerWord[]>([])
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Validate trial token on load
  useEffect(() => {
    const validateTrial = async () => {
      try {
        const response = await fetch('/api/trial/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: params.token }),
        })

        const result = await response.json()

        if (response.ok) {
          setTrialData(result)
          setTimeRemaining(result.timeRemaining)
          
          // Start countdown timer
          timerRef.current = setInterval(() => {
            setTimeRemaining(prev => {
              if (prev <= 1000) {
                setError('Your trial has expired')
                if (timerRef.current) clearInterval(timerRef.current)
                return 0
              }
              return prev - 1000
            })
          }, 1000)
          
        } else {
          setError(result.error || 'Invalid trial link')
        }
      } catch (err) {
        setError('Failed to validate trial. Please check your connection.')
      } finally {
        setLoading(false)
      }
    }

    validateTrial()

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [params.token])

  const formatTimeRemaining = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const startMindDump = async (language: Language) => {
    setCurrentLanguage(language)
    setCurrentWordIndex(0)
    setCurrentIdeas([])
    setAllIdeas([])
    setStartTime(new Date())
    
    try {
      // Load trigger words (read-only from existing table)
      const words = await getTriggerWords(language)
      const wordsList = words.map(w => w.word)
      setTriggerWords(wordsList)
      setTriggerWordsData(words)
    } catch {
      // Fallback words if database fails
      const fallbackWords = language === 'nl' 
        ? ['Werk', 'Familie', 'Gezondheid', 'Huis', 'Financiën']
        : ['Work', 'Family', 'Health', 'Home', 'Finance']
      setTriggerWords(fallbackWords)
      setTriggerWordsData([])
    }
    
    setCurrentScreen('minddump')
  }

  const handleIdeaSubmit = (idea: string) => {
    if (idea.trim()) {
      setCurrentIdeas(prev => [...prev, idea])
      setAllIdeas(prev => [...prev, idea])
      setIdeaInput('')
    } else {
      nextWord()
    }
  }

  const nextWord = () => {
    setCurrentIdeas([])
    const nextIndex = currentWordIndex + 1
    
    if (nextIndex >= triggerWords.length) {
      setCurrentScreen('finish')
    } else {
      setCurrentWordIndex(nextIndex)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleIdeaSubmit(ideaInput)
    }
  }

  const exportMindDump = () => {
    const textList = allIdeas.join('\n')
    const blob = new Blob([textList], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mind-dump-trial-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const goToPurchase = () => {
    window.open('https://order.minddumper.com/checkout/minddumper', '_blank')
  }

  if (loading) {
    return (
      <div className="screen active">
        <div className="app-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
          <div>Loading your trial...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="screen active">
        <div className="app-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
          <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>Trial Unavailable</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>{error}</p>
          <button className="btn-primary" onClick={goToPurchase}>
            Get Full Access - €49
          </button>
        </div>
      </div>
    )
  }

  const currentWord = triggerWords[currentWordIndex] || 'Loading...'
  const progress = triggerWords.length > 0 ? Math.round((currentWordIndex / triggerWords.length) * 100) : 0

  return (
    <div>
      {/* Trial Header - Always visible */}
      <div style={{
        background: '#fff3cd',
        border: '1px solid #ffeaa7',
        padding: '10px 20px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#856404'
      }}>
        <strong>🚀 Free Trial Mode</strong> | Time remaining: {formatTimeRemaining(timeRemaining)} | 
        <button 
          onClick={goToPurchase}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            textDecoration: 'underline',
            cursor: 'pointer',
            marginLeft: '10px'
          }}
        >
          Upgrade to Full Version
        </button>
      </div>

      {/* Language Selection */}
      {currentScreen === 'language' && (
        <div className="screen active">
          <div className="app-container">
            <div className="screen-header">
              <h2>Choose Your Language</h2>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Welcome {trialData?.email}! {trialData?.isFirstUse ? 'Your 24-hour trial starts now.' : ''}
              </p>
            </div>
            
            <div className="language-grid">
              <button className="language-option" onClick={() => startMindDump('nl')}>
                <div className="flag">🇳🇱</div>
                <span>Nederlands</span>
              </button>
              
              <button className="language-option" onClick={() => startMindDump('en')}>
                <div className="flag">🇬🇧</div>
                <span>English</span>
              </button>
              
              <button className="language-option" onClick={() => startMindDump('de')}>
                <div className="flag">🇩🇪</div>
                <span>Deutsch</span>
              </button>
              
              <button className="language-option" onClick={() => startMindDump('fr')}>
                <div className="flag">🇫🇷</div>
                <span>Français</span>
              </button>
              
              <button className="language-option" onClick={() => startMindDump('es')}>
                <div className="flag">🇪🇸</div>
                <span>Español</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mind Dump Screen */}
      {currentScreen === 'minddump' && (
        <div className="screen active">
          <div className="app-container">
            <div className="screen-header">
              <h2>Brain Dump (Trial)</h2>
              <button className="btn-stop" onClick={() => setCurrentScreen('finish')}>
                Stop
              </button>
            </div>
            
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <span className="progress-text">{progress}%</span>
            </div>
            
            <div className="trigger-container">
              <div className="trigger-word">{currentWord}</div>
              <div className="trigger-description">What comes to mind with this word?</div>
            </div>
            
            <div className="input-container">
              <input 
                type="text" 
                className="idea-input" 
                placeholder="Type your idea and press Enter..." 
                value={ideaInput}
                onChange={(e) => setIdeaInput(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
              <div className="input-help">Press Enter without text to go to the next word</div>
            </div>
            
            <div className="current-ideas">
              <h3>Ideas for "{currentWord}":</h3>
              <div className="ideas-list">
                {currentIdeas.map((idea, index) => (
                  <div key={index} className="idea-item">{idea}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Finish Screen */}
      {currentScreen === 'finish' && (
        <div className="screen active">
          <div className="app-container">
            <div className="screen-header">
              <h2>Trial Completed! 🎉</h2>
            </div>
            
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-number">{allIdeas.length}</span>
                <span className="stat-label">Ideas found</span>
              </div>
              <div className="stat">
                <span className="stat-number">{currentWordIndex}</span>
                <span className="stat-label">Trigger words used</span>
              </div>
            </div>
            
            <div className="ideas-overview">
              <h3>Your ideas:</h3>
              <div className="ideas-export-list">
                {allIdeas.slice(0, 10).map((idea, index) => (
                  <div key={index} className="export-item">{idea}</div>
                ))}
              </div>
              {allIdeas.length > 10 && (
                <div className="show-more">... and {allIdeas.length - 10} more ideas</div>
              )}
            </div>
            
            <div className="finish-actions">
              <button className="btn-primary large" onClick={exportMindDump}>
                Export My Ideas
              </button>
              
              <div style={{ margin: '30px 0', textAlign: 'center' }}>
                <h3 style={{ color: '#333', marginBottom: '15px' }}>Love MindDumper?</h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                  Get unlimited brain dumps, save your history, customize trigger words, and more!
                </p>
                <button className="btn-primary large" onClick={goToPurchase}>
                  Get Full Access - €49
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

### 5. Testing Checklist (1 hour)

#### Manual Tests
- [ ] Trial request form validation (empty, invalid, disposable emails)
- [ ] Email delivery and content formatting
- [ ] Trial link validation (valid, invalid, expired tokens)
- [ ] First use activation (timer starts correctly)
- [ ] Brain dump functionality in trial mode
- [ ] Timer countdown and expiration
- [ ] Export functionality works
- [ ] Purchase link redirects correctly
- [ ] Anti-abuse: Gmail+ variations blocked
- [ ] Mobile responsiveness

#### Database Tests
- [ ] Trial requests table created correctly
- [ ] Email normalization working
- [ ] Token uniqueness enforced
- [ ] Expiration logic accurate
- [ ] No impact on existing tables

### 6. Deployment Steps (1 hour)

#### Environment Variables
Add to production environment:
```bash
MAILGUN_API_KEY=your_key_here
MAILGUN_DOMAIN=mg.yourdomain.com  
MAILGUN_FROM_EMAIL=trial@minddumper.com
MAILGUN_FROM_NAME=MindDumper Trial
```

#### Database Migration
1. Run the migration: `supabase migration up`
2. Verify table creation in Supabase dashboard
3. Test RLS policies

#### Deploy Process
1. Build locally: `npm run build`
2. Fix any TypeScript errors
3. Test trial flow on localhost
4. Push to git and deploy
5. Test production trial flow
6. Monitor email delivery

## Success Metrics
- **Email delivery rate**: >95% (monitor bounces)
- **Trial completion rate**: >30% (users who finish brain dump)
- **Trial-to-paid conversion**: Target 5-15% within first week
- **Technical issues**: <1% error rate

## Future Improvements
- A/B test trial duration (24h vs 48h vs 7 days)
- Add trial reminder emails
- Phone verification for higher-value users
- Usage analytics and conversion tracking
- Automated follow-up email sequences

## Rollback Plan
If issues arise:
1. Disable trial form (comment out form component)
2. Add maintenance message
3. Investigate and fix issues
4. Re-enable when stable

The beauty of this implementation is that it can be completely disabled without affecting existing paid users, since it's entirely separate from the main application flow.