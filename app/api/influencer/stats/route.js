import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const JWT_SECRET = process.env.INFLUENCER_JWT_SECRET || 'influencer-secret-key-change-in-production'

export async function GET(request) {
  try {
    // Get token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    
    // Verify token
    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const influencerId = decoded.influencerId

    // Get influencer details
    const { data: influencer, error: influencerError } = await supabaseAdmin
      .from('influencers')
      .select('*')
      .eq('id', influencerId)
      .single()

    if (influencerError || !influencer) {
      return NextResponse.json({ error: 'Influencer not found' }, { status: 404 })
    }

    // Get orders for this influencer
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('influencer_orders')
      .select('*')
      .eq('influencer_id', influencerId)
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('Error fetching orders:', ordersError)
    }

    // Calculate stats
    const totalSales = orders?.reduce((sum, order) => sum + parseFloat(order.order_amount || 0), 0) || 0
    const totalCommission = orders?.reduce((sum, order) => sum + parseFloat(order.commission_amount || 0), 0) || 0
    const totalOrders = orders?.length || 0

    return NextResponse.json({
      influencer: {
        id: influencer.id,
        name: influencer.name,
        email: influencer.email,
        couponCode: influencer.coupon_code,
        commissionRate: influencer.commission_rate
      },
      stats: {
        totalSales,
        totalCommission,
        totalOrders
      },
      orders: orders || []
    })
  } catch (error) {
    console.error('Stats fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
