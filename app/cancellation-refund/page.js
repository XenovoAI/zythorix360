'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { RefreshCcw, Clock, CheckCircle, XCircle, Mail, ArrowLeft } from 'lucide-react'

export default function CancellationRefund() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6 border border-white/20">
            <RefreshCcw className="w-4 h-4 text-yellow-400" />
            <span className="text-white/90 text-sm font-medium">Refund Policy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Cancellation & Refund Policy</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            We want you to be completely satisfied with your purchase.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Refund Eligibility */}
          <div className="bg-green-50 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Eligible for Refund</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Request made within 7 days of purchase</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Material has not been downloaded more than twice</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Technical issues preventing access to purchased content</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Duplicate purchase made by mistake</span>
              </li>
            </ul>
          </div>

          {/* Not Eligible */}
          <div className="bg-red-50 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Not Eligible for Refund</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Request made after 7 days of purchase</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Material has been downloaded multiple times</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Change of mind after accessing the content</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Free materials or promotional items</span>
              </li>
            </ul>
          </div>

          {/* Process */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Refund Process</h2>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Submit Request</h3>
                  <p className="text-gray-600">Email us at zythorix360@gmail.com with your order details and reason for refund.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Review</h3>
                  <p className="text-gray-600">Our team will review your request within 2-3 business days.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Processing</h3>
                  <p className="text-gray-600">If approved, refund will be processed within 5-7 business days to your original payment method.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-violet-50 rounded-2xl p-8 text-center">
            <Mail className="w-12 h-12 text-violet-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-6">
              Contact us for any questions about refunds or cancellations.
            </p>
            <a href="mailto:zythorix360@gmail.com">
              <Button className="bg-violet-600 hover:bg-violet-700">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
