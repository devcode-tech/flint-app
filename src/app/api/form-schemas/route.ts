import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { generateFormId } from '@devcode-tech/form-builder'

/**
 * GET /api/form-schemas?contest_id=xxx
 * Fetch form schemas with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const contestId = searchParams.get('contest_id')
    const formId = searchParams.get('form_id')

    let query = supabase.from('form_schemas').select('*')

    if (contestId) {
      query = query.eq('contest_id', contestId)
    }

    if (formId) {
      query = query.eq('form_id', formId)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Error fetching form schemas:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/form-schemas
 * Create a new form schema
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, schema, contest_id } = body

    // Validation
    if (!title || !schema) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const embedId = generateFormId()

    const { data, error } = await supabase
      .from('form_schemas')
      .insert([
        {
          title,
          description: description || '',
          schema,
          form_id: embedId,
          contest_id: contest_id || null,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // If contest_id provided, link it to the contest
    if (contest_id) {
      await supabase
        .from('contests')
        .update({ form_schema_id: data.id })
        .eq('id', contest_id)
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error creating form schema:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
