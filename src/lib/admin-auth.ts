import { cookies } from 'next/headers'
import { createHash, randomBytes } from 'crypto'

const ADMIN_SESSION_COOKIE = 'admin_session'

// Validate admin password from environment (lazy loaded to prevent build errors)
function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD
  
  if (!password) {
    console.error('ADMIN_PASSWORD environment variable is missing')
    throw new Error('ADMIN_PASSWORD environment variable is required')
  }
  
  // More lenient validation for production compatibility
  if (password.length < 8) {
    console.error('ADMIN_PASSWORD too short:', password.length)
    throw new Error('ADMIN_PASSWORD must be at least 8 characters long')
  }
  
  // Basic validation - existing strong passwords should pass
  const hasLetters = /[a-zA-Z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialOrMixed = /[!@#$%^&*(),.?":{}|<>\-_]/.test(password) || (/[A-Z]/.test(password) && /[a-z]/.test(password))
  
  if (!hasLetters) {
    console.error('ADMIN_PASSWORD missing letters')
    throw new Error('ADMIN_PASSWORD must contain letters')
  }
  
  if (!hasNumbers && !hasSpecialOrMixed) {
    console.error('ADMIN_PASSWORD too simple')
    throw new Error('ADMIN_PASSWORD must contain numbers or mixed case/special characters')
  }
  
  console.log('ADMIN_PASSWORD validation passed, length:', password.length)
  return password
}

// Lazy load the password to prevent build errors
let ADMIN_PASSWORD: string | null = null
function getValidatedAdminPassword(): string {
  if (ADMIN_PASSWORD === null) {
    ADMIN_PASSWORD = getAdminPassword()
  }
  return ADMIN_PASSWORD
}

// Create a hash for the admin session with random salt
function createSessionHash(password: string, timestamp: number, salt: string): string {
  return createHash('sha256')
    .update(`${password}-${timestamp}-${salt}-admin-session`)
    .digest('hex')
}

// Verify admin password
export function verifyAdminPassword(password: string): boolean {
  return password === getValidatedAdminPassword()
}

// Create admin session
export async function createAdminSession(): Promise<string> {
  const timestamp = Date.now()
  const salt = randomBytes(16).toString('hex')
  const sessionToken = createSessionHash(getValidatedAdminPassword(), timestamp, salt)
  const sessionData = `${timestamp}-${salt}-${sessionToken}`
  
  // Set cookie that expires in 1 hour (reduced for security)
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1 * 60 * 60, // 1 hour (reduced from 4)
    path: '/'
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
    
    const parts = sessionData.split('-')
    if (parts.length !== 3) {
      return false
    }
    
    const [timestampStr, salt, providedHash] = parts
    const timestamp = parseInt(timestampStr)
    
    // Check if session is expired (1 hour)
    if (Date.now() - timestamp > 1 * 60 * 60 * 1000) {
      return false
    }
    
    // Verify the hash
    const expectedHash = createSessionHash(getValidatedAdminPassword(), timestamp, salt)
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
    const parts = sessionData.split('-')
    if (parts.length !== 3) {
      return false
    }
    
    const [timestampStr, salt, providedHash] = parts
    const timestamp = parseInt(timestampStr)
    
    // Check if session is expired (1 hour)
    if (Date.now() - timestamp > 1 * 60 * 60 * 1000) {
      return false
    }
    
    // Verify the hash
    const expectedHash = createSessionHash(getValidatedAdminPassword(), timestamp, salt)
    return expectedHash === providedHash
    
  } catch {
    return false
  }
}