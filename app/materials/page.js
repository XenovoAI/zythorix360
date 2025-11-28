'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuthModal from '@/components/AuthModal'
import { Button } from '@/components/ui/button'
import { 
  Search, Download, BookOpen, Filter, Star, TrendingUp, 
  X, Grid, List, SlidersHorizontal, ChevronDown, ShoppingCart
} from 'lucide-react'
import { toast } from 'sonner'

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([])
  const [filteredMaterials, setFilteredMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [selectedExam, setSelectedExam] = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user } = useAuth()
  const searchParams = useSearchParams()

  const subjects = ['All', 'Physics', 'Chemistry', 'Biology', 'Mathematics']
  const exams = ['All', 'NEET', 'JEE']

  useEffect(() => {
    const subjectParam = searchParams.get('subject')
    if (subjectParam && subjects.includes(subjectParam)) {
      setSelectedSubject(subjectParam)
    }
    loadMaterials()
  }, [searchParams])

  useEffect(() => {
    filterMaterials()
  }, [materials, searchQuery, selectedSubject, selectedExam])

  const loadMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setMaterials(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterMaterials = () => {
    let filtered = [...materials]
    
    if (searchQuery) {
      filtered = filtered.filter(m => 
        m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (selectedSubject !== 'All') {
      filtered = filtered.filter(m => m.subject === selectedSubject)
    }
    
    if (selectedExam !== 'All') {
      filtered = filtered.filter(m => m.exam_type === selectedExam)
    }
    
    setFilteredMaterials(filtered)
  }

  const handlePurchase = async (material) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    toast.info('Payment integration coming soon! This material will be ₹' + material.price)
    // TODO: Integrate Razorpay payment
  }

  const handleDownload = async (material) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    
    // Check if material needs to be purchased
    if (!material.is_free) {
      // Check if user has purchased this material
      const { data: purchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('material_id', material.id)
        .single()

      if (!purchase) {
        toast.error('Please purchase this material first')
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
          setMaterials(prev => 
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Hero Section */}
      <section className="pt-32 pb-12 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Study Materials
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Expert-curated notes, question banks, and practice materials for NEET & JEE
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-20 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search materials..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
              {/* Subject Filter */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {subjects.map(subject => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                      selectedSubject === subject
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 flex-shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredMaterials.length}</span> materials
            </p>
          </div>

          {loading ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-3xl p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredMaterials.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredMaterials.map((material) => (
                <MaterialCard 
                  key={material.id} 
                  material={material} 
                  viewMode={viewMode}
                  onDownload={handleDownload}
                  onPurchase={handlePurchase}
                  user={user}
                  getSubjectColor={getSubjectColor}
                  getSubjectBg={getSubjectBg}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No materials found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

function MaterialCard({ material, viewMode, onDownload, onPurchase, user, getSubjectColor, getSubjectBg }) {
  const [hasPurchased, setHasPurchased] = useState(material.is_free)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (!material.is_free && user) {
      checkPurchase()
    }
  }, [material.id, user])

  const checkPurchase = async () => {
    if (!user) return
    setChecking(true)
    try {
      const { data } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('material_id', material.id)
        .single()
      
      setHasPurchased(!!data)
    } catch (error) {
      setHasPurchased(false)
    } finally {
      setChecking(false)
    }
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 hover:shadow-xl transition-all duration-300 flex gap-6">
        <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 relative">
          {material.thumbnail_url ? (
            <img
              src={material.thumbnail_url}
              alt={material.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${getSubjectColor(material.subject)} flex items-center justify-center`}>
              <BookOpen className="w-12 h-12 text-white/50" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{material.title}</h3>
            <span className={`px-3 py-1 rounded-lg text-xs font-bold border flex-shrink-0 ${getSubjectBg(material.subject)}`}>
              {material.subject}
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{material.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-sm text-gray-500">{material.downloads || 0} downloads</span>
            </div>
            <div className="flex items-center gap-3">
              {material.is_free ? (
                <>
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-sm font-bold">FREE</span>
                  <Button onClick={() => onDownload(material)} className="bg-violet-600 hover:bg-violet-700 rounded-xl">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </>
              ) : hasPurchased ? (
                <>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-bold">PURCHASED</span>
                  <Button onClick={() => onDownload(material)} className="bg-violet-600 hover:bg-violet-700 rounded-xl">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-lg font-bold text-gray-900">₹{material.price}</span>
                  <Button onClick={() => onPurchase(material)} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 border border-gray-100 hover:border-violet-200 card-hover">
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
            <span className="px-4 py-1.5 bg-green-500 text-white rounded-xl text-xs font-bold shadow-lg">FREE</span>
          ) : (
            <span className="px-4 py-1.5 bg-white/90 text-gray-900 rounded-xl text-sm font-bold shadow-lg">₹{material.price}</span>
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
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{material.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
            <span className="text-sm text-gray-500 ml-1">(4.8)</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Download className="w-4 h-4" />
            {material.downloads || 0}
          </div>
        </div>

        {material.is_free ? (
          <Button
            onClick={() => onDownload(material)}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl py-3 font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Now
          </Button>
        ) : hasPurchased ? (
          <Button
            onClick={() => onDownload(material)}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl py-3 font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Now
          </Button>
        ) : (
          <Button
            onClick={() => onPurchase(material)}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl py-3 font-semibold shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Buy for ₹{material.price}
          </Button>
        )}
      </div>
    </div>
  )
}
