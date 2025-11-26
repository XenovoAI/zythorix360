import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Helper to check if user is admin
async function getAdminUser() {
  const cookieStore = cookies()
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

  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  // Check if user is admin
  if (user.user_metadata?.role !== 'admin') {
    return null
  }
  
  return user
}

// Generate unique coupon code
function generateCouponCode(name) {
  const base = name.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, 6)
  const suffix = Math.floor(Math.random() * 100)
  return `${base}${suffix}`
}

// GET - List all influencers with stats
export async function GET(request) {
  try {
    const adminUser = await getAdminUser()
    console.log('Admin check result:', adminUser ? `Found: ${adminUser.email}, role: ${adminUser.user_metadata?.role}` : 'No user found')
    
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    // Get all influencers
    const { data: influencers, error: influencersError } = await supabaseAdmin
      .from('influencers')
      .select('*')
      .order('created_at', { ascending: false })

    if (influencersError) throw influencersError

    // Get orders for each influencer
    const influencersWithStats = await Promise.all(
      (influencers || []).map(async (influencer) => {
        const { data: orders } = await supabaseAdmin
          .from('influencer_orders')
          .select('*')
          .eq('influencer_id', influencer.id)

        const totalSales = orders?.reduce((sum, o) => sum + parseFloat(o.order_amount || 0), 0) || 0
        const totalCommission = orders?.reduce((sum, o) => sum + parseFloat(o.commission_amount || 0), 0) || 0

        return {
          ...influencer,
          totalOrders: orders?.length || 0,
          totalSales,
          totalCommission
        }
      })
    )

    return NextResponse.json({ influencers: influencersWithStats })
  } catch (error) {
    console.error('Error fetching influencers:', error)
    return NextResponse.json({ error: 'Failed to fetch influencers' }, { status: 500 })
  }
}

// POST - Create new influencer
export async function POST(request) {
  try {
    const adminUser = await getAdminUser()
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, email, commissionRate = 10 } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existing } = await supabaseAdmin
      .from('influencers')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Generate coupon code
    let couponCode = generateCouponCode(name)

    // Ensure uniqueness
    let attempts = 0
    while (attempts < 10) {
      const { data: existingCoupon } = await supabaseAdmin
        .from('influencers')
        .select('id')
        .eq('coupon_code', couponCode)
        .single()

      if (!existingCoupon) break
      couponCode = generateCouponCode(name)
      attempts++
    }

    // Generate random password
    const tempPassword = Math.random().toString(36).slice(-8)
    const passwordHash = await bcrypt.hash(tempPassword, 10)

    // Create influencer
    const { data: influencer, error } = await supabaseAdmin
      .from('influencers')
      .insert({
        name,
        email,
        coupon_code: couponCode,
        password_hash: passwordHash,
        commission_rate: commissionRate,
        is_active: true
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      influencer: {
        id: influencer.id,
        name: influencer.name,
        email: influencer.email,
        couponCode: influencer.coupon_code,
        commissionRate: influencer.commission_rate
      },
      tempPassword
    })
  } catch (error) {
    console.error('Error creating influencer:', error)
    return NextResponse.json({ error: 'Failed to create influencer' }, { status: 500 })
  }
}

// DELETE - Delete influencer
export async function DELETE(request) {
  try {
    const adminUser = await getAdminUser()
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Influencer ID required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('influencers')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting influencer:', error)
    return NextResponse.json({ error: 'Failed to delete influencer' }, { status: 500 })
  }
}
