import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function getAdminUser() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) return null
  if (user.user_metadata?.role !== 'admin') return null

  return user
}

export async function GET(request) {
  try {
    const adminUser = await getAdminUser()
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all influencers with their orders
    const { data: influencers, error } = await supabaseAdmin
      .from('influencers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Build CSV data
    const csvRows = []
    csvRows.push(['Name', 'Email', 'Coupon Code', 'Commission Rate', 'Total Orders', 'Total Sales (₹)', 'Total Commission (₹)', 'Status', 'Created At'])

    for (const influencer of (influencers || [])) {
      const { data: orders } = await supabaseAdmin
        .from('influencer_orders')
        .select('*')
        .eq('influencer_id', influencer.id)

      const totalSales = orders?.reduce((sum, o) => sum + parseFloat(o.order_amount || 0), 0) || 0
      const totalCommission = orders?.reduce((sum, o) => sum + parseFloat(o.commission_amount || 0), 0) || 0

      csvRows.push([
        influencer.name,
        influencer.email,
        influencer.coupon_code,
        `${influencer.commission_rate}%`,
        orders?.length || 0,
        totalSales.toFixed(2),
        totalCommission.toFixed(2),
        influencer.is_active ? 'Active' : 'Inactive',
        new Date(influencer.created_at).toLocaleDateString()
      ])
    }

    const csvContent = csvRows.map(row => row.join(',')).join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="influencers-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
