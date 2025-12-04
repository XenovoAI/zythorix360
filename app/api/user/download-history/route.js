import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request) {
  try {
    const cookieStore = await cookies()
    
    // Create Supabase client with cookies for auth
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

    // Get authenticated user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('download-history auth check:', user ? user.email : 'No user', authError?.message || '')

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    // Get user's download history - RLS will automatically filter by user_id
    const { data: downloads, error } = await supabase
      .from('material_downloads')
      .select(`
        id,
        material_id,
        material_title,
        material_type,
        downloaded_at
      `)
      .eq('user_id', user.id)
      .order('downloaded_at', { ascending: false })

    if (error) throw error

    // Get material details for each download
    const downloadsWithMaterials = await Promise.all(
      (downloads || []).map(async (download) => {
        const { data: material } = await supabase
          .from('materials')
          .select('id, title, description, subject, class, thumbnail_url, is_free, price, pdf_url')
          .eq('id', download.material_id)
          .single()

        return {
          ...download,
          materials: material || null
        }
      })
    )

    return NextResponse.json(downloadsWithMaterials)
  } catch (error) {
    console.error('Error fetching download history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch download history' },
      { status: 500 }
    )
  }
}
