'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

export default function RazorpayButton({ material, onSuccess, className }) {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to purchase')
      return
    }

    setLoading(true)

    try {
      // Create order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          materialId: material.id,
          amount: material.price,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Zythorix360',
        description: material.title,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                materialId: material.id,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok) {
              toast.success('Payment successful!')
              onSuccess?.()
            } else {
              throw new Error(verifyData.error || 'Payment verification failed')
            }
          } catch (error) {
            console.error('Verification error:', error)
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: '#7c3aed',
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className={className}
    >
      {loading ? 'Processing...' : `Buy Now ₹${material.price}`}
    </Button>
  )
}
