'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuthModal from '@/components/AuthModal'
import { Button } from '@/components/ui/button'
import { 
  Download, BookOpen, ShoppingCart, ArrowLeft, Share2, 
  FileText, CheckCircle, Star, Users, Copy
} from 'lucide-react'
import { toast } from 'sonner'

export default function MaterialPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [material, setMaterial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [checkingPurchase, setCheckingPurchase] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (params.id) loadMaterial()
  }, [params.id])

  useEffect(() => {
    if (material && user && !material.is_free) checkPurchaseStatus()
  }, [material, user])

  const loadMaterial = async () => {
    try {
      const { data, error } = await supabase.from('materials').select('*').eq('id', params.id).single()
      if (error) throw error
      setMaterial(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkPurchaseStatus = async () => {
    if (!user) return
    setCheckingPurchase(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/purchases/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ materialId: material.id, userId: user.id })
      })
      const { hasPurchased } = await response.json()
      setHasPurchased(hasPurchased)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setCheckingPurchase(false)
    }
  }

  const handlePurchase = async () => {
    if (!user) { setShowAuthModal(true); return }
    try {
      toast.loading('Initiating payment...')
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ materialId: material.id, userId: user.id })
      })
      const orderData = await response.json()
      if (!response.ok) throw new Error(orderData.error)

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)
      script.onload = () => {
        new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Zythorix360',
          description: material.title,
          order_id: orderData.orderId,
          handler: async (response) => {
            try {
              toast.loading('Verifying...')
              const verifyResponse = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  materialId: material.id,
                  userId: user.id
                })
              })
              if (!verifyResponse.ok) throw new Error('Verification failed')
              toast.success('Payment successful!')
              setHasPurchased(true)
            } catch (error) {
              toast.error('Payment verification failed')
            }
          },
          prefill: { email: user.email },
          theme: { color: '#8b5cf6' },
          modal: { ondismiss: () => toast.error('Payment cancelled') }
        }).open()
      }
    } catch (error) {
      toast.error(error.message || 'Payment failed')
    }
  }

  const handleDownload = async () => {
    if (!user) { setShowAuthModal(true); return }
    if (!material.is_free && !hasPurchased) { toast.error('Please purchase first'); return }
    try {
      const { data: { session } } = await supabase.auth.getSession()
      await fetch('/api/materials/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ materialId: material.id, userId: user.id })
      })
      if (material.pdf_url) { window.open(material.pdf_url, '_blank'); toast.success('Download started!') }
    } catch (error) {
      toast.error('Download failed')
    }
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  const getSubjectColor = (subject) => ({
    'Physics': 'bg-blue-500',
    'Chemistry': 'bg-emerald-500',
    'Biology': 'bg-pink-500',
    'Mathematics': 'bg-amber-500'
  }[subject] || 'bg-violet-500')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet-500 border-t-transparent"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <FileText className="w-12 h-12 text-gray-600 mb-3" />
          <h1 className="text-lg font-semibold text-white mb-1">Material Not Found</h1>
          <p className="text-sm text-gray-500 mb-4">This material doesn't exist.</p>
          <Link href="/materials">
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-sm">
              <ArrowLeft className="w-3 h-3 mr-1" /> Back
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-8">
        {/* Back */}
        <Link href="/materials" className="inline-flex items-center text-sm text-gray-500 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Materials
        </Link>

        {/* Card */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
          <div className="grid md:grid-cols-2">
            
            {/* Image */}
            <div className="relative aspect-video md:aspect-square">
              {material.thumbnail_url ? (
                <Image src={material.thumbnail_url} alt={material.title} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <BookOpen className="w-16 h-16 text-gray-700" />
                </div>
              )}
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`${getSubjectColor(material.subject)} text-white text-xs font-medium px-2.5 py-1 rounded-md`}>
                  {material.subject}
                </span>
                {material.is_free && (
                  <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-md">FREE</span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 md:p-6 flex flex-col">
              {/* Title */}
              <h1 className="text-xl font-bold text-white mb-2">{material.title}</h1>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{material.description || 'Study material for exam preparation.'}</p>

              {/* Stats */}
              <div className="flex gap-4 mb-4 text-xs">
                {material.class && (
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <BookOpen className="w-3.5 h-3.5 text-violet-400" />
                    <span>{material.class}</span>
                  </div>
                )}
                {material.exam_type && (
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Star className="w-3.5 h-3.5 text-yellow-400" />
                    <span>{material.exam_type}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>{material.downloads || 0}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-800 my-4"></div>

              {/* Price */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-xs text-gray-500 block mb-0.5">Price</span>
                  {material.is_free ? (
                    <span className="text-2xl font-bold text-green-400">FREE</span>
                  ) : (
                    <span className="text-2xl font-bold text-white">₹{material.price}</span>
                  )}
                </div>
                {hasPurchased && (
                  <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5" /> Purchased
                  </span>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-auto">
                {material.is_free || hasPurchased ? (
                  <Button onClick={handleDownload} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm h-10">
                    <Download className="w-4 h-4 mr-1.5" /> Download
                  </Button>
                ) : (
                  <Button onClick={handlePurchase} disabled={checkingPurchase} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white text-sm h-10">
                    <ShoppingCart className="w-4 h-4 mr-1.5" /> 
                    {checkingPurchase ? 'Loading...' : `Buy ₹${material.price}`}
                  </Button>
                )}
                <Button onClick={handleShare} variant="outline" className="h-10 px-3 border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300">
                  <Copy className="w-4 h-4 mr-1.5" />
                  <span className="text-sm">Copy Link</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
