import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's purchases with material details
    const { data: purchases, error } = await supabase
      .from('purchases')
      .select('*, materials(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Purchases query error:', error)
      return NextResponse.json({ 
        error: 'Failed to load purchases',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ purchases: purchases || [] })
  } catch (error) {
    console.error('My purchases error:', error)
    return NextResponse.json({ 
      error: 'Failed to load purchases',
      details: error.message 
    }, { status: 500 })
  }
}
