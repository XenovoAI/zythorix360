'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import {
  Plus, Trash2, Download, Users, IndianRupee, TrendingUp,
  ShoppingCart, X, Copy, Eye, ArrowLeft, RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'

export default function AdminInfluencersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [influencers, setInfluencers] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCredentialsModal, setShowCredentialsModal] = useState(false)
  const [newCredentials, setNewCredentials] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    commissionRate: 10
  })

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) throw error

      if (!session) {
        toast.error('Please login to access admin panel')
        router.push('/login')
        return
      }

      if (session.user.user_metadata?.role !== 'admin') {
        toast.error('Access denied. Admin only.')
        router.push('/')
        return
      }

      setUser(session.user)
      loadInfluencers()
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadInfluencers = async () => {
    try {
      // Fetch influencers directly from Supabase
      const { data: influencersData, error } = await supabase
        .from('influencers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Fetch orders for stats
      const { data: ordersData } = await supabase
        .from('influencer_orders')
        .select('*')

      // Calculate stats for each influencer
      const influencersWithStats = (influencersData || []).map(influencer => {
        const orders = (ordersData || []).filter(o => o.influencer_id === influencer.id)
        const totalSales = orders.reduce((sum, o) => sum + parseFloat(o.order_amount || 0), 0)
        const totalCommission = orders.reduce((sum, o) => sum + parseFloat(o.commission_amount || 0), 0)

        return {
          ...influencer,
          totalOrders: orders.length,
          totalSales,
          totalCommission
        }
      })

      setInfluencers(influencersWithStats)
    } catch (error) {
      console.error('Load error:', error)
      toast.error('Failed to load influencers')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const response = await fetch('/api/influencer/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Influencer created!')
        setNewCredentials({
          name: data.influencer.name,
          couponCode: data.influencer.couponCode,
          tempPassword: data.tempPassword
        })
        setShowAddModal(false)
        setShowCredentialsModal(true)
        setFormData({ name: '', email: '', commissionRate: 10 })
        loadInfluencers()
      } else {
        toast.error(data.error || 'Failed to create influencer')
      }
    } catch (error) {
      toast.error('Failed to create influencer')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete influencer "${name}"? This cannot be undone.`)) return

    try {
      const { error } = await supabase
        .from('influencers')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Influencer deleted')
      loadInfluencers()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const handleExport = () => {
    // Build CSV from current data
    const csvRows = []
    csvRows.push(['Name', 'Email', 'Coupon Code', 'Commission Rate', 'Total Orders', 'Total Sales', 'Total Commission', 'Status'])

    influencers.forEach(inf => {
      csvRows.push([
        inf.name,
        inf.email,
        inf.coupon_code,
        `${inf.commission_rate}%`,
        inf.totalOrders,
        inf.totalSales.toFixed(2),
        inf.totalCommission.toFixed(2),
        inf.is_active ? 'Active' : 'Inactive'
      ])
    })

    const csvContent = csvRows.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `influencers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Export downloaded!')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied!')
  }

  // Calculate totals
  const totalSales = influencers.reduce((sum, i) => sum + (i.totalSales || 0), 0)
  const totalCommission = influencers.reduce((sum, i) => sum + (i.totalCommission || 0), 0)
  const totalOrders = influencers.reduce((sum, i) => sum + (i.totalOrders || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link href="/admin" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Influencer Management</h1>
            <p className="text-gray-600">Manage affiliate partners and track performance</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={loadInfluencers}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => setShowAddModal(true)} className="bg-sky-600 hover:bg-sky-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Influencer
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Influencers</p>
                <p className="text-2xl font-bold">{influencers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <IndianRupee className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold">₹{totalSales.toFixed(0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Commission</p>
                <p className="text-2xl font-bold">₹{totalCommission.toFixed(0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Influencers Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">All Influencers</h2>
          </div>

          {influencers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No influencers yet</p>
              <Button onClick={() => setShowAddModal(true)} className="bg-sky-600 hover:bg-sky-700">
                <Plus className="w-4 h-4 mr-2" />
                Add First Influencer
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coupon</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earned</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {influencers.map((influencer) => (
                    <tr key={influencer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{influencer.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {influencer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                            {influencer.coupon_code}
                          </code>
                          <button
                            onClick={() => copyToClipboard(influencer.coupon_code)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {influencer.commission_rate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {influencer.totalOrders || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{(influencer.totalSales || 0).toFixed(0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ₹{(influencer.totalCommission || 0).toFixed(0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(influencer.id, influencer.name)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Influencer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Influencer</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                <input
                  type="number"
                  value={formData.commissionRate}
                  onChange={(e) => setFormData({ ...formData, commissionRate: parseInt(e.target.value) || 10 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  min="1"
                  max="50"
                />
              </div>

              <p className="text-sm text-gray-500">
                A unique coupon code and temporary password will be auto-generated.
              </p>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-sky-600 hover:bg-sky-700"
                >
                  {formLoading ? 'Creating...' : 'Create Influencer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credentials Modal */}
      {showCredentialsModal && newCredentials && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Influencer Created!</h2>
              <p className="text-gray-600 text-sm mt-1">Share these credentials with {newCredentials.name}</p>
            </div>

            <div className="space-y-4 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Coupon Code (Login ID)</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-white border rounded font-mono text-lg">
                    {newCredentials.couponCode}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(newCredentials.couponCode)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Temporary Password</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-white border rounded font-mono text-lg">
                    {newCredentials.tempPassword}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(newCredentials.tempPassword)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <p className="text-xs text-red-600 mt-4 text-center">
              ⚠️ Save these credentials now! The password won't be shown again.
            </p>

            <Button
              onClick={() => {
                setShowCredentialsModal(false)
                setNewCredentials(null)
              }}
              className="w-full mt-6 bg-sky-600 hover:bg-sky-700"
            >
              Done
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
