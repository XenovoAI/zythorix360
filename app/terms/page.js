'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { FileText, CheckCircle, AlertCircle, CreditCard, BookOpen, Scale } from 'lucide-react'

export default function TermsOfService() {
  const sections = [
    {
      icon: CheckCircle,
      title: 'Acceptance of Terms',
      content: `By accessing or using Zythorix360, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.

These terms apply to all users of the platform, including students, educators, and visitors.`
    },
    {
      icon: BookOpen,
      title: 'Use of Services',
      content: `Our services are intended for educational purposes only. You agree to:
      • Use the platform only for lawful purposes
      • Not share your account credentials with others
      • Not redistribute or resell our study materials
      • Not attempt to circumvent any security measures
      • Respect intellectual property rights`
    },
    {
      icon: CreditCard,
      title: 'Payments & Refunds',
      content: `• All payments are processed securely through Razorpay
      • Prices are listed in Indian Rupees (INR)
      • Digital products are available immediately after purchase
      • Refunds are available within 7 days of purchase if you're unsatisfied
      • To request a refund, contact us at zythorix360@gmail.com`
    },
    {
      icon: FileText,
      title: 'Intellectual Property',
      content: `All content on Zythorix360, including study materials, graphics, logos, and software, is owned by us or our licensors and is protected by copyright laws.

You may:
      • Download materials for personal, non-commercial use
      • Print materials for your own study purposes

You may not:
      • Share, distribute, or sell our materials
      • Remove any copyright notices
      • Use materials for commercial purposes`
    },
    {
      icon: AlertCircle,
      title: 'Limitation of Liability',
      content: `Zythorix360 provides study materials as educational aids. We do not guarantee:
      • Specific exam results or scores
      • Accuracy of all information (though we strive for it)
      • Uninterrupted access to services

We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.`
    },
    {
      icon: Scale,
      title: 'Governing Law',
      content: `These Terms of Service are governed by the laws of India. Any disputes shall be resolved in the courts of India.

We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.`
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
            <FileText className="w-4 h-4 text-yellow-400" />
            <span className="text-white/90 text-sm font-medium">Legal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Please read these terms carefully before using our platform.
          </p>
          <p className="text-white/60 mt-4">Last updated: November 2024</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <div className="mt-12 p-8 bg-violet-50 rounded-2xl text-center">
            <p className="text-gray-600">
              Questions about our terms? Contact us at{' '}
              <a href="mailto:zythorix360@gmail.com" className="text-violet-600 hover:underline font-medium">
                zythorix360@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
