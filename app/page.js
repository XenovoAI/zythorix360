'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  BookOpen, Users, Award, Download, Star, TrendingUp, Zap, Target, 
  Brain, Rocket, ChevronRight, Play, CheckCircle, ArrowRight,
  Sparkles, GraduationCap, FileText, Clock, Shield
} from 'lucide-react'
import { Button } from './components/ui/button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import { toast } from 'sonner'

export default function Home() {
  const [featuredMaterials, setFeaturedMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    loadFeaturedMaterials()
  }, [])

  const loadFeaturedMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('downloads', { ascending: false })
        .limit(6)
      if (error) throw error
      setFeaturedMaterials(data || [])
    } catch (error) {
      console.error('Error loading materials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (material) => {
    if (!user) {
      setPendingAction({ type: 'purchase', material })
      setShowAuthModal(true)
      return
    }

    toast.info('Payment integration coming soon! This material will be ₹' + material.price)
    // TODO: Integrate Razorpay payment
  }

  const handleDownload = async (material) => {
    if (!user) {
      setPendingAction({ type: 'download', material })
      setShowAuthModal(true)
      return
    }

    // Check if material needs to be purchased
    if (!material.is_free) {
      const { data: purchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('material_id', material.id)
        .single()

      if (!purchase) {
        handlePurchase(material)
        return
      }
    }
    
    try {
      // Track download
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const response = await fetch('/api/materials/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            materialId: material.id,
            userId: user.id
          })
        })

        const result = await response.json()
        if (response.ok && result.isNewDownload) {
          // Update local state with new download count
          setFeaturedMaterials(prev => 
            prev.map(m => m.id === material.id 
              ? { ...m, downloads: result.downloadCount }
              : m
            )
          )
        }
      }

      // Open PDF
      window.open(material.pdf_url, '_blank')
      toast.success('Download started!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download')
    }
  }

  const getSubjectColor = (subject) => {
    const colors = {
      Physics: 'from-blue-500 to-cyan-500',
      Chemistry: 'from-green-500 to-emerald-500',
      Biology: 'from-purple-500 to-pink-500',
      Mathematics: 'from-orange-500 to-amber-500'
    }
    return colors[subject] || 'from-gray-500 to-slate-500'
  }

  const getSubjectBg = (subject) => {
    const colors = {
      Physics: 'bg-blue-50 text-blue-600 border-blue-200',
      Chemistry: 'bg-green-50 text-green-600 border-green-200',
      Biology: 'bg-purple-50 text-purple-600 border-purple-200',
      Mathematics: 'bg-orange-50 text-orange-600 border-orange-200'
    }
    return colors[subject] || 'bg-gray-50 text-gray-600 border-gray-200'
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setPendingAction(null)}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 pattern-dots opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/20">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-white/90 text-sm font-medium">Trusted by 10,000+ Students</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Crack NEET & JEE with
                <span className="block mt-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                  Zythorix360
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Expert-curated study materials, comprehensive question banks, and practice tests designed to help you succeed in medical and engineering entrance exams.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/materials">
                  <Button className="w-full sm:w-auto bg-white text-violet-700 hover:bg-gray-100 px-6 py-3 text-base font-semibold rounded-xl shadow-lg transition-all duration-300 group">
                    <BookOpen className="mr-2 w-4 h-4" />
                    Explore Materials
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/register">
                  <button style={{backgroundColor: 'transparent', color: 'white'}} className="w-full sm:w-auto border-2 border-white hover:bg-white hover:text-violet-700 px-6 py-3 text-base font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 inline-flex items-center justify-center">
                    Start Free Trial
                  </button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6">
                {[
                  { icon: CheckCircle, text: 'Expert Content' },
                  { icon: Zap, text: 'Instant Access' },
                  { icon: Shield, text: 'Secure Payment' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/70">
                    <item.icon className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Stats Cards */}
            <div className="hidden lg:block relative">
              <div className="relative w-full h-[500px]">
                {/* Floating Cards */}
                <div className="absolute top-0 right-0 glass rounded-3xl p-6 animate-float shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Success Rate</p>
                      <p className="text-3xl font-bold text-white">95%</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/3 left-0 glass rounded-3xl p-6 animate-float shadow-2xl" style={{animationDelay: '1s'}}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Active Students</p>
                      <p className="text-3xl font-bold text-white">10K+</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-10 right-10 glass rounded-3xl p-6 animate-float shadow-2xl" style={{animationDelay: '2s'}}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Study Materials</p>
                      <p className="text-3xl font-bold text-white">500+</p>
                    </div>
                  </div>
                </div>

                {/* Center Illustration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-500/30 backdrop-blur-xl flex items-center justify-center">
                  <GraduationCap className="w-32 h-32 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>


      {/* Featured Materials */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <span className="inline-block px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold mb-4">
                Popular Resources
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Featured Study Materials
              </h2>
            </div>
            <Link href="/materials">
              <Button variant="outline" className="group border-violet-200 hover:border-violet-400 hover:bg-violet-50">
                View All Materials
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-3xl p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : featuredMaterials.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredMaterials.map((material) => (
                <div key={material.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 border border-gray-100 hover:border-violet-200 card-hover">
                  <div className="relative h-48 overflow-hidden">
                    {/* Thumbnail Image */}
                    {material.thumbnail_url ? (
                      <img
                        src={material.thumbnail_url}
                        alt={material.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${getSubjectColor(material.subject)}`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-white/30" />
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay gradient for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-sm ${getSubjectBg(material.subject)}`}>
                        {material.subject}
                      </span>
                      {material.is_free ? (
                        <span className="px-4 py-1.5 bg-green-500 text-white rounded-xl text-xs font-bold shadow-lg">
                          FREE
                        </span>
                      ) : (
                        <span className="px-4 py-1.5 bg-white/90 text-gray-900 rounded-xl text-sm font-bold shadow-lg">
                          ₹{material.price}
                        </span>
                      )}
                    </div>
                    
                    {/* Class badge at bottom */}
                    {material.class && (
                      <div className="absolute bottom-4 left-4 z-10">
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg text-xs font-bold shadow-lg">
                          {material.class}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
                      {material.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {material.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-sm text-gray-500 ml-1">(4.8)</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Download className="w-4 h-4" />
                        {material.downloads || 0}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleDownload(material)}
                      className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl py-3 font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Materials coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 relative">
        <div className="absolute inset-0 pattern-grid"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to <span className="gradient-text">Excel</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive preparation tools designed by experts to maximize your success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, title: 'Expert Content', desc: 'Curated by IIT & AIIMS toppers and experienced educators', color: 'from-violet-500 to-purple-600' },
              { icon: Users, title: '10,000+ Students', desc: 'Join our growing community of successful aspirants', color: 'from-blue-500 to-cyan-600' },
              { icon: Award, title: '95% Success Rate', desc: 'Proven track record in NEET and JEE examinations', color: 'from-green-500 to-emerald-600' },
              { icon: Download, title: 'Instant Access', desc: 'Download materials immediately after purchase', color: 'from-orange-500 to-pink-600' }
            ].map((feature, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl blur-xl -z-10" 
                     style={{background: `linear-gradient(135deg, var(--tw-gradient-stops))`}}></div>
                <div className="bg-white border border-gray-100 rounded-3xl p-8 hover:border-violet-200 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '10,000+', label: 'Active Students', icon: Users },
              { value: '95%', label: 'Success Rate', icon: TrendingUp },
              { value: '500+', label: 'Study Materials', icon: FileText },
              { value: '50,000+', label: 'Downloads', icon: Download }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <p className="text-white/70 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-[3rem] p-12 lg:p-20 overflow-hidden">
            <div className="absolute inset-0 pattern-dots opacity-10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative text-center max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-white/80 mb-10">
                Join thousands of successful students and take the first step towards your dream career
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/materials">
                  <Button className="w-full sm:w-auto bg-white text-violet-700 hover:bg-gray-100 px-6 py-3 text-base font-semibold rounded-xl shadow-lg">
                    <BookOpen className="mr-2 w-4 h-4" />
                    Browse Materials
                  </Button>
                </Link>
                <Link href="/register">
                  <button style={{backgroundColor: 'transparent', color: 'white'}} className="w-full sm:w-auto border-2 border-white hover:bg-white hover:text-violet-700 px-6 py-3 text-base font-semibold rounded-xl transition-all duration-300 inline-flex items-center justify-center">
                    Create Free Account
                  </button>
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
