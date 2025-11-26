'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Truck, Download, Clock, Globe, CheckCircle, ArrowLeft } from 'lucide-react'

export default function Shipping() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6 border border-white/20">
            <Truck className="w-4 h-4 text-yellow-400" />
            <span className="text-white/90 text-sm font-medium">Delivery Info</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Shipping & Delivery</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Get instant access to all your purchased materials.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Digital Delivery */}
          <div className="bg-green-50 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">100% Digital Delivery</h2>
            </div>
            <p className="text-gray-700 text-lg mb-6">
              All our study materials are delivered digitally. This means:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Instant Access:</strong> Download immediately after purchase</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>No Shipping Costs:</strong> All materials are free to download</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Available 24/7:</strong> Access your materials anytime, anywhere</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Eco-Friendly:</strong> No paper waste, better for the environment</span>
              </li>
            </ul>
          </div>

          {/* How It Works */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Complete Purchase</h3>
                  <p className="text-gray-600">Pay securely using Razorpay (UPI, Cards, Net Banking)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Instant Confirmation</h3>
                  <p className="text-gray-600">Receive email confirmation with download links</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Download & Study</h3>
                  <p className="text-gray-600">Access materials from your dashboard anytime</p>
                </div>
              </div>
            </div>
          </div>

          {/* Global Access */}
          <div className="bg-blue-50 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Access From Anywhere</h2>
            </div>
            <p className="text-gray-700">
              Our digital materials can be accessed from anywhere in the world. Whether you're at home, in a library, or traveling, your study materials are always just a click away. All you need is an internet connection to download your materials.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/materials">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700 px-8 py-6 text-lg rounded-2xl">
                Browse Study Materials
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
