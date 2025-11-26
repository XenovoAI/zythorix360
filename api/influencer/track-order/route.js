import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// This endpoint is called after successful payment to track influencer sales
export async function POST(request) {
  try {
    const { 
      couponCode, 
      orderAmount, 
      discountAmount = 0,
      customerEmail,
      materialId,
      paymentId 
    } = await request.json()

    if (!couponCode || !orderAmount) {
      return NextResponse.json(
        { error: 'Coupon code and order amount required' },
        { status: 400 }
      )
    }

    // Find influencer by coupon code
    const { data: influencer, error: influencerError } = await supabaseAdmin
      .from('influencers')
      .select('id, commission_rate')
      .eq('coupon_code', couponCode.toUpperCase())
      .eq('is_active', true)
      .single()

    if (influencerError || !influencer) {
      return NextResponse.json(
        { error: 'Invalid coupon code' },
        { status: 400 }
      )
    }

    // Calculate commission
    const commissionAmount = (orderAmount * influencer.commission_rate) / 100

    // Create order record
    const { data: order, error: orderError } = await supabaseAdmin
      .from('influencer_orders')
      .insert({
        influencer_id: influencer.id,
        order_amount: orderAmount,
        discount_amount: discountAmount,
        commission_amount: commissionAmount,
        coupon_used: couponCode.toUpperCase(),
        customer_email: customerEmail,
        material_id: materialId,
        payment_id: paymentId,
        status: 'completed'
      })
      .select()
      .single()

    if (orderError) throw orderError

    return NextResponse.json({
      success: true,
      orderId: order.id,
      commissionAmount
    })
  } catch (error) {
    console.error('Track order error:', error)
    return NextResponse.json(
      { error: 'Failed to track order' },
      { status: 500 }
    )
  }
}
