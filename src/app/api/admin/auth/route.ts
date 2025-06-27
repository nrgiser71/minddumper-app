import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminPassword, createAdminSession, clearAdminSession } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { password, action } = await request.json()
    
    if (action === 'logout') {
      await clearAdminSession()
      return NextResponse.json({ success: true })
    }
    
    if (action === 'login') {
      if (!password) {
        return NextResponse.json(
          { success: false, error: 'Wachtwoord is verplicht' },
          { status: 400 }
        )
      }
      
      if (verifyAdminPassword(password)) {
        await createAdminSession()
        return NextResponse.json({ success: true })
      } else {
        return NextResponse.json(
          { success: false, error: 'Ongeldig wachtwoord' },
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