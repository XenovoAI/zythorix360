'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Clock, Award, Download, Target, BookOpen, Users, ChevronRight, Lock, FileText } from 'lucide-react'
import { toast } from 'sonner'

export default function TestsPage() {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { user } = useAuth()
  const router = useRouter()

  const categories = ['All', 'NEET', 'JEE', 'Physics', 'Chemistry', 'Biology', 'Mathematics']

  useEffect(() => {
    loadTests()
  }, [])

  const loadTests = async () => {
    try {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setTests(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTests = selectedCategory === 'All' 
    ? tests 
    : tests.filter(t => t.category === selectedCategory || t.subject === selectedCategory)

  const handleDownloadTest = async (test) => {
    if (!user) {
      toast.error('Please login to download tests')
      router.push('/login')
      return
    }

    if (!test.is_free) {
      // Check if user has purchased this test
      const { data: purchase } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)
        .eq('material_id', test.id)
        .single()

      if (!purchase) {
        toast.error('Please purchase this test to download')
        return
      }
    }

    try {
      // Track download
      await supabase.from('test_downloads').insert({
        user_id: user.id,
        user_email: user.email,
        test_id: test.id,
        test_title: test.title,
        test_type: test.is_free ? 'free' : 'paid'
      })

      // Increment download count
      await supabase
        .from('tests')
        .update({ downloads: (test.downloads || 0) + 1 })
        .eq('id', test.id)

      // Download PDF
      if (test.pdf_url) {
        window.open(test.pdf_url, '_blank')
        toast.success('Download started!')
      } else {
        toast.error('PDF not available')
      }
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download test')
    }
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: 'bg-green-100 text-green-600',
      Medium: 'bg-yellow-100 text-yellow-600',
      Hard: 'bg-red-100 text-red-600'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-600'
  }

  const displayTests = filteredTests

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6 border border-white/20">
            <Target className="w-4 h-4 text-yellow-400" />
            <span className="text-white/90 text-sm font-medium">Practice Tests</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Test Your Knowledge
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Take mock tests, track your progress, and improve your exam performance
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, value: '100+', label: 'Practice Tests' },
              { icon: Users, value: '50K+', label: 'Tests Taken' },
              { icon: Award, value: '95%', label: 'Satisfaction' },
              { icon: Clock, value: '24/7', label: 'Available' }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-20 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tests Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded mt-6"></div>
                </div>
              ))}
            </div>
          ) : displayTests.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTests.map((test) => (
                <div key={test.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-violet-100 text-violet-600 rounded-lg text-xs font-semibold">
                      {test.category}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getDifficultyColor(test.difficulty)}`}>
                      {test.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-violet-600 transition-colors">
                    {test.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{test.duration} mins</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm">{test.questions} Qs</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{test.attempts?.toLocaleString() || 0} attempts</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Download className="w-4 h-4" />
                      <span className="text-sm">{test.downloads?.toLocaleString() || 0} downloads</span>
                    </div>
                  </div>

                  {test.is_free ? (
                    <Button
                      onClick={() => handleDownloadTest(test)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Free
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Price</span>
                        <span className="text-xl font-bold text-gray-900">₹{test.price}</span>
                      </div>
                      <Button
                        onClick={() => handleDownloadTest(test)}
                        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tests found</h3>
              <p className="text-gray-500">Tests will be available soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 pattern-dots opacity-10"></div>
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-4">
                Want More Practice?
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Access our complete library of study materials to complement your test preparation
              </p>
              <Link href="/materials">
                <Button size="lg" className="bg-white text-violet-700 hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-2xl">
                  <BookOpen className="mr-2 w-5 h-5" />
                  Browse Materials
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
