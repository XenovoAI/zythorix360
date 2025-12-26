import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request) {
  try {
    console.log('Testing Supabase connection...')
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Key present:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // Test 1: Check if we can query materials (public table)
    const { data: materials, error: materialsError } = await supabase
      .from('materials')
      .select('id, title')
      .limit(1)

    console.log('Materials query result:', { materials, materialsError })

    // Test 2: Check purchases table structure
    const { data: purchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('*')
      .limit(0)

    console.log('Purchases query result:', { purchases, purchasesError })

    return NextResponse.json({
      success: true,
      tests: {
        materials: {
          success: !materialsError,
          error: materialsError?.message,
          data: materials
        },
        purchases: {
          success: !purchasesError,
          error: purchasesError?.message,
          hint: purchasesError?.hint
        }
      }
    })
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
