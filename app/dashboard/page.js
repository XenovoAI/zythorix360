'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, FileText, Clock, Award, TrendingUp, Target, 
  Download, Calendar, User, Settings, ChevronRight, Sparkles
} from 'lucide-react'
import { toast } from 'sonner'

export default function DashboardPage() {
  const [downloads, setDownloads] = useState([])
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    if (user) {
      loadUserData()

      // Set up real-time subscription for downloads
      const downloadsSubscription = supabase
        .channel('user-downloads')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'material_downloads',
          filter: `user_id=eq.${user.id}`
        }, () => {
          loadUserData()
        })
        .subscribe()

      // Cleanup subscription
      return () => {
        downloadsSubscription.unsubscribe()
      }
    }
  }, [user, authLoading, router])

  const loadUserData = async () => {
    try {
      // Load download history from material_downloads table
      const { data: downloadData, error: downloadError } = await supabase
        .from('material_downloads')
        .select('*, materials(*)')
        .eq('user_id', user.id)
        .order('downloaded_at', { ascending: false })

      if (downloadError) {
        console.error('Download error:', downloadError)
      }
      
      setDownloads(downloadData || [])

      // Load purchases
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('purchases')
        .select('*, materials(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (purchaseError) {
        console.error('Purchase error:', purchaseError)
      }
      
      setPurchases(purchaseData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Materials Downloaded', value: downloads.length, icon: Download, color: 'from-violet-500 to-purple-600' },
    { label: 'Purchases', value: purchases.length, icon: FileText, color: 'from-blue-500 to-cyan-600' },
    { label: 'Total Materials', value: downloads.length + purchases.length, icon: BookOpen, color: 'from-green-500 to-emerald-600' },
    { label: 'This Month', value: downloads.filter(d => {
      const downloadDate = new Date(d.downloaded_at)
      const now = new Date()
      return downloadDate.getMonth() === now.getMonth() && downloadDate.getFullYear() === now.getFullYear()
    }).length, icon: TrendingUp, color: 'from-orange-500 to-pink-600' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-8 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Welcome back, {user?.user_metadata?.full_name || 'Student'}!
              </h1>
              <p className="text-white/70">{user?.email}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 -mt-16 relative z-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Downloads */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Downloads</h2>
                <Link href="/materials" className="text-violet-600 hover:text-violet-700 text-sm font-medium flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {downloads.length > 0 ? (
                <div className="space-y-4">
                  {downloads.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        {item.materials?.thumbnail_url ? (
                          <img
                            src={item.materials.thumbnail_url}
                            alt={item.materials.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {item.materials?.title || item.material_title || 'Material'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.materials?.subject} • {item.materials?.class}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Downloaded {new Date(item.downloaded_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-violet-600 hover:text-violet-700 hover:bg-violet-50"
                        onClick={() => {
                          if (item.materials?.pdf_url) {
                            window.open(item.materials.pdf_url, '_blank')
                            toast.success('Opening PDF...')
                          }
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Download className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No downloads yet</p>
                  <Link href="/materials">
                    <Button className="bg-violet-600 hover:bg-violet-700">
                      Browse Materials
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/materials" className="group">
                <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white hover:shadow-xl hover:shadow-violet-500/20 transition-all duration-300">
                  <BookOpen className="w-10 h-10 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Study Materials</h3>
                  <p className="text-white/80 text-sm mb-4">Access notes, PDFs, and question banks</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium">
                    Explore <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
              <Link href="/tests" className="group">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
                  <Target className="w-10 h-10 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Practice Tests</h3>
                  <p className="text-white/80 text-sm mb-4">Take mock exams and track progress</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium">
                    Start Test <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">
                    {(user?.user_metadata?.full_name || user?.email || 'U')[0].toUpperCase()}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900">{user?.user_metadata?.full_name || 'Student'}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Member since</span>
                  <span className="font-medium text-gray-900 text-sm">
                    {new Date(user?.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500 text-sm">Account type</span>
                  <span className="px-3 py-1 bg-violet-100 text-violet-600 rounded-full text-xs font-semibold">
                    Free
                  </span>
                </div>
              </div>
            </div>

            {/* Upgrade Card */}
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <Sparkles className="w-10 h-10 mb-4" />
              <h3 className="text-xl font-bold mb-2">Upgrade to Pro</h3>
              <p className="text-white/80 text-sm mb-4">
                Get unlimited access to all materials and premium features
              </p>
              <Button className="w-full bg-white text-violet-600 hover:bg-gray-100">
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
