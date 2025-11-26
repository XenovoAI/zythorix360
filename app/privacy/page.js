'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Shield, Lock, Eye, Database, Bell, Mail } from 'lucide-react'

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes:
      • Name and email address
      • Payment information (processed securely through Razorpay)
      • Usage data and preferences
      • Device and browser information`
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: `We use the information we collect to:
      • Provide, maintain, and improve our services
      • Process transactions and send related information
      • Send you technical notices and support messages
      • Respond to your comments and questions
      • Personalize your learning experience`
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: `We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
      • Encryption of data in transit and at rest
      • Regular security assessments
      • Access controls and authentication
      • Secure payment processing through Razorpay`
    },
    {
      icon: Bell,
      title: 'Communications',
      content: `We may send you emails about:
      • Your account and purchases
      • New study materials and features
      • Important updates to our services
      • Promotional offers (you can opt out anytime)
      
      You can manage your communication preferences in your account settings.`
    },
    {
      icon: Shield,
      title: 'Your Rights',
      content: `You have the right to:
      • Access your personal data
      • Correct inaccurate data
      • Request deletion of your data
      • Object to processing of your data
      • Data portability
      
      To exercise these rights, please contact us at zythorix360@gmail.com`
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6 border border-white/20">
            <Shield className="w-4 h-4 text-yellow-400" />
            <span className="text-white/90 text-sm font-medium">Your Privacy Matters</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            We are committed to protecting your privacy and ensuring the security of your personal information.
          </p>
          <p className="text-white/60 mt-4">Last updated: November 2024</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg leading-relaxed mb-12">
              At Zythorix360, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>

            <div className="space-y-12">
              {sections.map((section, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                      <section.icon className="w-6 h-6 text-violet-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                  </div>
                  <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-violet-50 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <Mail className="w-6 h-6 text-violet-600" />
                <h3 className="text-xl font-bold text-gray-900">Contact Us</h3>
              </div>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:zythorix360@gmail.com" className="text-violet-600 hover:underline font-medium">
                  zythorix360@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
