import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    const { materialId, userId } = await request.json()
    
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !userId) {
      return NextResponse.json({ hasPurchased: false }, { status: 200 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ hasPurchased: false }, { status: 200 })
    }

    // Check if user has purchased this material
    const { data: purchase, error } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('material_id', materialId)
      .maybeSingle()

    return NextResponse.json({ 
      hasPurchased: !error && !!purchase 
    })
  } catch (error) {
    console.error('Check purchase error:', error)
    return NextResponse.json({ hasPurchased: false }, { status: 200 })
  }
}
