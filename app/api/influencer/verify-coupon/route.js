import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const { couponCode } = await request.json()

    if (!couponCode) {
      return NextResponse.json(
        { valid: false, error: 'Coupon code is required' },
        { status: 400 }
      )
    }

    // Find active influencer with this coupon
    const { data: influencer, error } = await supabaseAdmin
      .from('influencers')
      .select('id, name, coupon_code, commission_rate')
      .eq('coupon_code', couponCode.toUpperCase())
      .eq('is_active', true)
      .single()

    if (error || !influencer) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid or expired coupon code'
      })
    }

    // Default 10% discount for customers using influencer code
    const discountPercent = 10

    return NextResponse.json({
      valid: true,
      couponCode: influencer.coupon_code,
      discountPercent,
      influencerId: influencer.id,
      message: `Coupon applied! You get ${discountPercent}% off`
    })
  } catch (error) {
    console.error('Coupon verification error:', error)
    return NextResponse.json(
      { valid: false, error: 'Failed to verify coupon' },
      { status: 500 }
    )
  }
}
