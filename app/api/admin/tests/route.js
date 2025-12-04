import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET - Fetch all tests
export async function GET(request) {
  try {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ tests: data })
  } catch (error) {
    console.error('Error fetching tests:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create new test
export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'abhi@zythorix360.com')
      .split(',')
      .map(e => e.trim().toLowerCase())
    
    if (!adminEmails.includes(user.email?.toLowerCase())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    
    // Use admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('tests')
      .insert([body])
      .select()

    if (error) throw error

    return NextResponse.json({ test: data[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating test:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update test
export async function PUT(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'abhi@zythorix360.com')
      .split(',')
      .map(e => e.trim().toLowerCase())
    
    if (!adminEmails.includes(user.email?.toLowerCase())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    // Use admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('tests')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json({ test: data[0] })
  } catch (error) {
    console.error('Error updating test:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Delete test
export async function DELETE(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'abhi@zythorix360.com')
      .split(',')
      .map(e => e.trim().toLowerCase())
    
    if (!adminEmails.includes(user.email?.toLowerCase())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Test ID required' }, { status: 400 })
    }

    // Use admin client to bypass RLS
    const { error } = await supabaseAdmin
      .from('tests')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Test deleted successfully' })
  } catch (error) {
    console.error('Error deleting test:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
