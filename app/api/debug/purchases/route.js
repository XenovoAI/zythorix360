import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    // Get all purchases (admin view for debugging)
    const { data: purchases, error } = await supabaseAdmin
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json({ 
        error: error.message,
        details: error 
      }, { status: 500 })
    }

    // Get material details separately
    const purchasesWithDetails = await Promise.all(
      (purchases || []).map(async (purchase) => {
        const { data: material } = await supabaseAdmin
          .from('materials')
          .select('title, subject')
          .eq('id', purchase.material_id)
          .single()
        
        return {
          ...purchase,
          material_title: material?.title,
          material_subject: material?.subject
        }
      })
    )

    return NextResponse.json({ 
      success: true,
      count: purchases?.length || 0,
      purchases: purchasesWithDetails
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}
