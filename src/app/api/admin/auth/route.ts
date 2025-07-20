import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminPassword, createAdminSession, clearAdminSession } from '@/lib/admin-auth'

// Simple in-memory rate limiter for admin login attempts
interface RateLimitData {
  attempts: number
  lastAttempt: number
  blockedUntil?: number
}

const rateLimitStore = new Map<string, RateLimitData>()
const MAX_ATTEMPTS = 5
const BLOCK_DURATION = 15 * 60 * 1000 // 15 minutes
const RESET_WINDOW = 15 * 60 * 1000 // 15 minutes

function getClientIdentifier(request: NextRequest): string {
  // Use IP address and user agent for fingerprinting
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             '127.0.0.1'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  return `${ip}-${userAgent.substring(0, 50)}`
}

function checkRateLimit(clientId: string): { allowed: boolean; remainingAttempts?: number; blockTimeLeft?: number } {
  const now = Date.now()
  const data = rateLimitStore.get(clientId)
  
  if (!data) {
    rateLimitStore.set(clientId, { attempts: 0, lastAttempt: now })
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS }
  }
  
  // Check if currently blocked
  if (data.blockedUntil && now < data.blockedUntil) {
    const blockTimeLeft = Math.ceil((data.blockedUntil - now) / 1000 / 60)
    return { allowed: false, blockTimeLeft }
  }
  
  // Reset if window has passed
  if (now - data.lastAttempt > RESET_WINDOW) {
    data.attempts = 0
    data.blockedUntil = undefined
  }
  
  // Check if max attempts reached
  if (data.attempts >= MAX_ATTEMPTS) {
    data.blockedUntil = now + BLOCK_DURATION
    const blockTimeLeft = Math.ceil(BLOCK_DURATION / 1000 / 60)
    return { allowed: false, blockTimeLeft }
  }
  
  return { 
    allowed: true, 
    remainingAttempts: MAX_ATTEMPTS - data.attempts 
  }
}

function recordFailedAttempt(clientId: string) {
  const now = Date.now()
  const data = rateLimitStore.get(clientId) || { attempts: 0, lastAttempt: now }
  data.attempts++
  data.lastAttempt = now
  rateLimitStore.set(clientId, data)
}

function recordSuccessfulLogin(clientId: string) {
  // Clear rate limit data on successful login
  rateLimitStore.delete(clientId)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password, action, email } = body
    
    // Handle different request formats (legacy compatibility)
    const loginAction = action || (email ? 'login' : null)
    const loginPassword = password
    
    if (loginAction === 'logout') {
      await clearAdminSession()
      return NextResponse.json({ success: true })
    }
    
    if (loginAction === 'login') {
      const clientId = getClientIdentifier(request)
      
      // Check rate limiting for login attempts only
      const rateCheck = checkRateLimit(clientId)
      if (!rateCheck.allowed) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Te veel inlogpogingen. Probeer opnieuw over ${rateCheck.blockTimeLeft} minuten.`,
            rateLimited: true,
            blockTimeLeft: rateCheck.blockTimeLeft
          },
          { status: 429 }
        )
      }
      
      if (!loginPassword) {
        recordFailedAttempt(clientId)
        return NextResponse.json(
          { 
            success: false, 
            error: 'Wachtwoord is verplicht',
            remainingAttempts: rateCheck.remainingAttempts! - 1
          },
          { status: 400 }
        )
      }
      
      if (verifyAdminPassword(loginPassword)) {
        recordSuccessfulLogin(clientId)
        await createAdminSession()
        return NextResponse.json({ success: true })
      } else {
        recordFailedAttempt(clientId)
        const newRateCheck = checkRateLimit(clientId)
        
        if (!newRateCheck.allowed) {
          return NextResponse.json(
            { 
              success: false, 
              error: `Ongeldig wachtwoord. Te veel pogingen - geblokkeerd voor ${newRateCheck.blockTimeLeft} minuten.`,
              rateLimited: true,
              blockTimeLeft: newRateCheck.blockTimeLeft
            },
            { status: 429 }
          )
        }
        
        return NextResponse.json(
          { 
            success: false, 
            error: 'Ongeldig wachtwoord',
            remainingAttempts: newRateCheck.remainingAttempts
          },
          { status: 401 }
        )
      }
    }
    
    return NextResponse.json(
      { success: false, error: 'Ongeldige actie' },
      { status: 400 }
    )
    
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server fout' },
      { status: 500 }
    )
  }
}