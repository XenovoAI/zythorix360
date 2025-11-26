'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { 
  LogIn, Copy, IndianRupee, ShoppingCart, TrendingUp, 
  Calendar, CheckCircle, Eye, EyeOff 
} from 'lucide-react'
import { toast } from 'sonner'

export default function InfluencerPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loginLoading, setLoginLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Login form
  const [couponCode, setCouponCode] = useState('')
  const [password, setPassword] = useState('')
  
  // Dashboard data
  const [influencer, setInfluencer] = useState(null)
  const [stats, setStats] = useState({ totalSales: 0, totalCommission: 0, totalOrders: 0 })
  const [orders, setOrders] = useState([])

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('influencer_token')
    if (token) {
      fetchStats(token)
    } else {
      setLoading(false)
    }
  }

  const fetchStats = async (token) => {
    try {
      const response = await fetch('/api/influencer/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setInfluencer(data.influencer)
        setStats(data.stats)
        setOrders(data.orders)
        setIsLoggedIn(true)
      } else {
        localStorage.removeItem('influencer_token')
      }
    } catch (error) {
      console.error('Fetch stats error:', error)
      localStorage.removeItem('influencer_token')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true)

    try {
      const response = await fetch('/api/influencer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('influencer_token', data.token)
        setInfluencer(data.influencer)
        toast.success('Login successful!')
        fetchStats(data.token)
      } else {
        toast.error(data.error || 'Login failed')
      }
    } catch (error) {
      toast.error('Login failed')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('influencer_token')
    setIsLoggedIn(false)
    setInfluencer(null)
    setStats({ totalSales: 0, totalCommission: 0, totalOrders: 0 })
    setOrders([])
    toast.success('Logged out')
  }

  const copyCode = () => {
    navigator.clipboard.writeText(influencer?.couponCode || '')
    toast.success('Coupon code copied!')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

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
        {!isLoggedIn ? (
          // Login Form
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Influencer Portal</h1>
              <p className="text-gray-600">Login with your unique coupon code</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code (Your ID)
                  </label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase"
                    placeholder="e.g., JOHN42"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 pr-12"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-sky-600 hover:bg-sky-700 py-3"
                >
                  {loginLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Logging in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 justify-center">
                      <LogIn className="w-4 h-4" />
                      Login
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </div>
        ) : (
          // Dashboard
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {influencer?.name}!</h1>
                <p className="text-gray-600">Track your affiliate performance</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>

            {/* Coupon Code Card */}
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-6 mb-8 text-white">
              <p className="text-sm opacity-90 mb-2">Your Coupon Code</p>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold tracking-wider">{influencer?.couponCode}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={copyCode}
                  className="bg-white/20 hover:bg-white/30 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <p className="text-sm opacity-80 mt-2">
                Commission Rate: {influencer?.commissionRate}%
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <IndianRupee className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-900">₹{stats.totalSales.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Commission Earned</p>
                    <p className="text-2xl font-bold text-gray-900">₹{stats.totalCommission.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <ShoppingCart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No orders yet</p>
                  <p className="text-sm text-gray-500">Share your coupon code to start earning!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {formatDate(order.created_at)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₹{parseFloat(order.order_amount).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            ₹{parseFloat(order.commission_amount).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3" />
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
