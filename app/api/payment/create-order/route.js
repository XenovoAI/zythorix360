import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  console.log('=== Payment Create Order API Called ===')
  try {
    const body = await request.json()
    console.log('Request body:', body)
    const { materialId, userId } = body

    // Verify authentication
    const authHeader = request.headers.get('authorization')
    console.log('Auth header present:', !!authHeader)
    
    if (!authHeader || !userId) {
      console.log('Unauthorized: Missing auth or userId')
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

    // Get material details
    const { data: material, error: materialError } = await supabase
      .from('materials')
      .select('*')
      .eq('id', materialId)
      .single()

    if (materialError || !material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 })
    }

    if (material.is_free) {
      return NextResponse.json({ error: 'Material is free' }, { status: 400 })
    }

    // Check if Razorpay keys are configured
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay keys not configured')
      return NextResponse.json({ 
        error: 'Payment gateway not configured. Please contact support.' 
      }, { status: 500 })
    }

    console.log('Initializing Razorpay with key:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    console.log('Creating order for material:', material.title, 'Amount:', material.price)

    // Create Razorpay order
    // Receipt must be max 40 chars, so use timestamp + random
    const receipt = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    
    const order = await razorpay.orders.create({
      amount: material.price * 100, // Amount in paise
      currency: 'INR',
      receipt: receipt,
      notes: {
        materialId: material.id,
        materialTitle: material.title,
        userId: user.id,
        userEmail: user.email,
      },
    })

    console.log('Order created successfully:', order.id)

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      material: {
        id: material.id,
        title: material.title,
        price: material.price,
      },
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create order',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
