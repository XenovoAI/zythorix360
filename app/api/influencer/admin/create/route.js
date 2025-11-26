import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function generateCouponCode(name) {
  const base = name.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, 6)
  const suffix = Math.floor(Math.random() * 100)
  return `${base}${suffix}`
}

export async function POST(request) {
  try {
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
