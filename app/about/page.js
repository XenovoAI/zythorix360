'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { 
  GraduationCap, Target, Users, Award, BookOpen, Heart, 
  Lightbulb, Rocket, CheckCircle, ArrowRight
} from 'lucide-react'

export default function AboutPage() {
  const values = [
    { icon: Target, title: 'Excellence', desc: 'We strive for the highest quality in everything we create' },
    { icon: Heart, title: 'Student-First', desc: 'Every decision we make puts students at the center' },
    { icon: Lightbulb, title: 'Innovation', desc: 'Constantly improving our methods and materials' },
    { icon: Users, title: 'Community', desc: 'Building a supportive learning community' }
  ]

  const stats = [
    { value: '10,000+', label: 'Students Helped' },
    { value: '95%', label: 'Success Rate' },
    { value: '500+', label: 'Study Materials' },
    { value: '50+', label: 'Expert Educators' }
  ]

  const team = [
    { name: 'Expert Educators', role: 'IIT & AIIMS Alumni', desc: 'Our content is created by toppers who understand what it takes to succeed' },
    { name: 'Subject Specialists', role: 'PhD Holders', desc: 'Deep expertise in Physics, Chemistry, Biology, and Mathematics' },
    { name: 'Tech Team', role: 'Engineers', desc: 'Building the best learning platform for students' }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6 border border-white/20">
            <GraduationCap className="w-4 h-4 text-yellow-400" />
            <span className="text-white/90 text-sm font-medium">About Zythorix360</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Empowering Students to
            <span className="block text-yellow-400">Achieve Their Dreams</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            We're on a mission to make quality education accessible to every NEET and JEE aspirant across India
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold mb-6">
                Our Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Making Quality Education <span className="gradient-text">Accessible</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Zythorix360 was founded with a simple belief: every student deserves access to high-quality study materials, regardless of their background or location.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We combine the expertise of IIT and AIIMS toppers with modern technology to create comprehensive, easy-to-understand study materials that help students crack competitive exams.
              </p>
              <div className="space-y-4">
                {['Expert-curated content by toppers', 'Affordable pricing for all students', 'Comprehensive coverage of syllabus', 'Regular updates with latest patterns'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-12 text-white">
                <Rocket className="w-16 h-16 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-white/80 leading-relaxed">
                  To become India's most trusted platform for competitive exam preparation, helping millions of students achieve their dreams of becoming doctors and engineers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold mb-4">
              Our Values
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Drives Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our core values guide everything we do at Zythorix360
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-violet-500/30">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold mb-4">
              Our Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet the Experts
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our team of educators and experts are dedicated to your success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-violet-200 transition-all duration-300">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-violet-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 pattern-dots opacity-10"></div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already preparing with Zythorix360
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/materials">
                  <Button size="lg" className="bg-white text-violet-700 hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-2xl">
                    <BookOpen className="mr-2 w-5 h-5" />
                    Explore Materials
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-2xl">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
