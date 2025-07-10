import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(request: NextRequest) {
  try {
    const { categoryId, newName, categoryType } = await request.json()

    if (!categoryId || !newName || !categoryType) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    let result
    
    if (categoryType === 'main') {
      // Update main category
      result = await supabase
        .from('main_categories')
        .update({ name: newName.trim() })
        .eq('id', categoryId)
    } else if (categoryType === 'sub') {
      // Update sub category
      result = await supabase
        .from('sub_categories')
        .update({ name: newName.trim() })
        .eq('id', categoryId)
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid category type' 
      }, { status: 400 })
    }

    if (result.error) {
      console.error('Database error:', result.error)
      return NextResponse.json({ 
        success: false, 
        error: 'Database error: ' + result.error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Category updated successfully' 
    })

  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update category' 
    }, { status: 500 })
  }
}