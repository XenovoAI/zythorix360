import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const JWT_SECRET = process.env.INFLUENCER_JWT_SECRET || 'influencer-secret-key-change-in-production'

export async function POST(request) {
  try {
    const { couponCode, password } = await request.json()

    if (!couponCode || !password) {
      return NextResponse.json(
        { error: 'Coupon code and password are required' },
        { status: 400 }
      )
    }

    // Find influencer by coupon code
    const { data: influencer, error } = await supabaseAdmin
      .from('influencers')
      .select('*')
      .eq('coupon_code', couponCode.toUpperCase())
      .eq('is_active', true)
      .single()

    if (error || !influencer) {
      return NextResponse.json(
        { error: 'Invalid coupon code or account inactive' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, influencer.password_hash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        influencerId: influencer.id, 
        couponCode: influencer.coupon_code,
        name: influencer.name 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      success: true,
      token,
      influencer: {
        id: influencer.id,
        name: influencer.name,
        email: influencer.email,
        couponCode: influencer.coupon_code,
        commissionRate: influencer.commission_rate
      }
    })
  } catch (error) {
    console.error('Influencer login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
