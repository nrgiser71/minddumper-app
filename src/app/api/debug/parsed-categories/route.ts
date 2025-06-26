import { NextResponse } from 'next/server'
import { getAvailableCategories } from '@/lib/user-words'

export async function GET() {
  try {
    const categories = await getAvailableCategories()
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}