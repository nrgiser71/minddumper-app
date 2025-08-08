import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSessionFromRequest } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get('cookie')
    const isAuthorized = verifyAdminSessionFromRequest(request)
    
    return NextResponse.json({
      success: true,
      debug: {
        hasCookie: !!cookie,
        cookieValue: cookie ? cookie.substring(0, 100) + '...' : null,
        isAuthorized,
        timestamp: Date.now()
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        timestamp: Date.now()
      }
    })
  }
}