import { cookies } from 'next/headers'
import { createHash } from 'crypto'

const ADMIN_SESSION_COOKIE = 'admin_session'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

// Create a hash for the admin session
function createSessionHash(password: string, timestamp: number): string {
  return createHash('sha256')
    .update(`${password}-${timestamp}-admin-session`)
    .digest('hex')
}

// Verify admin password
export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

// Create admin session
export async function createAdminSession(): Promise<string> {
  const timestamp = Date.now()
  const sessionToken = createSessionHash(ADMIN_PASSWORD, timestamp)
  const sessionData = `${timestamp}-${sessionToken}`
  
  // Set cookie that expires in 4 hours
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 4 * 60 * 60, // 4 hours
    path: '/admin'
  })
  
  return sessionData
}

// Verify admin session
export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const sessionData = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
    
    if (!sessionData) {
      return false
    }
    
    const [timestampStr, providedHash] = sessionData.split('-')
    const timestamp = parseInt(timestampStr)
    
    // Check if session is expired (4 hours)
    if (Date.now() - timestamp > 4 * 60 * 60 * 1000) {
      return false
    }
    
    // Verify the hash
    const expectedHash = createSessionHash(ADMIN_PASSWORD, timestamp)
    return expectedHash === providedHash
    
  } catch {
    return false
  }
}

// Clear admin session
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
}

// Client-side session check (for API routes)
export function verifyAdminSessionFromRequest(request: Request): boolean {
  try {
    const cookie = request.headers.get('cookie')
    if (!cookie) return false
    
    const sessionMatch = cookie.match(new RegExp(`${ADMIN_SESSION_COOKIE}=([^;]+)`))
    if (!sessionMatch) return false
    
    const sessionData = sessionMatch[1]
    const [timestampStr, providedHash] = sessionData.split('-')
    const timestamp = parseInt(timestampStr)
    
    // Check if session is expired
    if (Date.now() - timestamp > 4 * 60 * 60 * 1000) {
      return false
    }
    
    // Verify the hash
    const expectedHash = createSessionHash(ADMIN_PASSWORD, timestamp)
    return expectedHash === providedHash
    
  } catch {
    return false
  }
}