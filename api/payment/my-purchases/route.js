import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request) {
  try {
    const cookieStore = await cookies()
    
    // Create Supabase client with cookies for auth
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // Get authenticated user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('my-purchases auth check:', user ? user.email : 'No user', authError?.message || '')

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    // Get user's purchases with material details
    const { data: purchases, error } = await supabase
      .from('purchases')
      .select(`
        id,
        material_id,
        payment_id,
        amount,
        status,
        created_at,
        updated_at,
        materials (
          id,
          title,
          description,
          subject,
          class,
          pdf_url,
          thumbnail_url,
          price
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching purchases:', error)
      throw error
    }

    // Transform with material details included
    const simplifiedPurchases = (purchases || []).map(purchase => ({
      id: purchase.id,
      materialId: purchase.material_id,
      paymentId: purchase.payment_id,
      amount: purchase.amount,
      status: purchase.status,
      createdAt: purchase.created_at,
      materials: purchase.materials
    }))

    return NextResponse.json(simplifiedPurchases, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })
  } catch (error) {
    console.error('Error in my-purchases API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchases', details: error.message },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
