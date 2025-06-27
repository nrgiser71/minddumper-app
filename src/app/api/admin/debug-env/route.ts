import { NextResponse } from 'next/server'

export async function GET() {
  const adminPassword = process.env.ADMIN_PASSWORD
  
  return NextResponse.json({
    hasAdminPassword: !!adminPassword,
    passwordLength: adminPassword?.length || 0,
    isDefault: adminPassword === 'admin123',
    timestamp: new Date().toISOString()
  })
}