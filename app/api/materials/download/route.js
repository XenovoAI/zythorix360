import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request) {
  try {
    const { materialId, userId } = await request.json()

    if (!materialId) {
      return NextResponse.json({ error: 'Material ID required' }, { status: 400 })
    }

    // Get auth header for user verification
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user with client
    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get material details
    const { data: material, error: materialError } = await supabaseAdmin
      .from('materials')
      .select('*')
      .eq('id', materialId)
      .single()

    if (materialError || !material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 })
    }

    // Check if user already downloaded this material
    const { data: existingDownload } = await supabaseAdmin
      .from('material_downloads')
      .select('id')
      .eq('material_id', materialId)
      .eq('user_id', userId)
      .single()

    const isNewDownload = !existingDownload

    // Record download in material_downloads table
    if (isNewDownload) {
      await supabaseAdmin
        .from('material_downloads')
        .insert([{
          user_id: userId,
          user_email: user.email,
          material_id: materialId,
          material_title: material.title,
          material_type: material.is_free ? 'free' : 'paid',
          downloaded_at: new Date().toISOString()
        }])

      // Increment download count in materials table
      await supabaseAdmin
        .from('materials')
        .update({ 
          downloads: (material.downloads || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', materialId)
    }

    return NextResponse.json({ 
      success: true, 
      isNewDownload,
      downloadCount: isNewDownload ? (material.downloads || 0) + 1 : material.downloads
    }, { status: 200 })

  } catch (error) {
    console.error('Download tracking error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
