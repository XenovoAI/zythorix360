import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasPublicKey: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    hasSecretKey: !!process.env.RAZORPAY_KEY_SECRET,
    publicKeyPrefix: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.substring(0, 15) || 'NOT SET',
    secretKeyPrefix: process.env.RAZORPAY_KEY_SECRET?.substring(0, 10) || 'NOT SET',
  })
}
