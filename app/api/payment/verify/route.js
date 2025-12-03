import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      materialId,
      userId 
    } = await request.json()

    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify Razorpay signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature

    if (!isAuthentic) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Get material details
    const { data: material } = await supabaseAdmin
      .from('materials')
      .select('*')
      .eq('id', materialId)
      .single()

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 })
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert([{
        user_id: userId,
        amount: material.price,
        payment_method: 'razorpay',
        razorpay_order_id,
        razorpay_payment_id,
        status: 'completed',
        completed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (paymentError) {
      console.error('Payment record error:', paymentError)
      return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 })
    }

    // Create purchase record
    const { error: purchaseError } = await supabaseAdmin
      .from('purchases')
      .insert([{
        user_id: userId,
        material_id: materialId,
        payment_id: payment.id,
        amount: material.price,
        status: 'completed',
        created_at: new Date().toISOString(),
      }])

    if (purchaseError) {
      console.error('Purchase record error:', purchaseError)
      return NextResponse.json({ error: 'Failed to record purchase' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and purchase recorded',
      paymentId: payment.id,
    })
  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
