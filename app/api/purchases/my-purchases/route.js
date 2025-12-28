import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔍 Fetching purchases for user:', user.id)

    // Use admin client to bypass RLS
    const { data: purchases, error } = await supabaseAdmin
      .from('purchases')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    console.log('📊 Query result:', { 
      error: error?.message, 
      count: purchases?.length,
      purchases: purchases 
    })

    if (error) {
      console.error('Purchases query error:', error)
      return NextResponse.json({ 
        error: 'Failed to load purchases',
        details: error.message 
      }, { status: 500 })
    }

    // Get material details for each purchase using admin client
    const purchasesWithMaterials = await Promise.all(
      (purchases || []).map(async (purchase) => {
        const { data: material } = await supabaseAdmin
          .from('materials')
          .select('*')
          .eq('id', purchase.material_id)
          .single()
        
        console.log('📦 Material for purchase:', purchase.id, material?.title)
        
        return {
          ...purchase,
          materials: material
        }
      })
    )

    console.log('✅ Returning purchases:', purchasesWithMaterials.length)

    return NextResponse.json({ purchases: purchasesWithMaterials })
  } catch (error) {
    console.error('My purchases error:', error)
    return NextResponse.json({ 
      error: 'Failed to load purchases',
      details: error.message 
    }, { status: 500 })
  }
}
