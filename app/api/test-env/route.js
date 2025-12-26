import { NextResponse } from 'next/server'

export async function GET(request) {
  return NextResponse.json({
    razorpay: {
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      keyIdLength: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.length,
      keyIdPrefix: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.substring(0, 15),
      hasSecret: !!process.env.RAZORPAY_KEY_SECRET,
      secretLength: process.env.RAZORPAY_KEY_SECRET?.length,
      secretPrefix: process.env.RAZORPAY_KEY_SECRET?.substring(0, 10)
    },
    supabase: {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }
  })
}
