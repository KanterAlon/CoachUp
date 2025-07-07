import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { studentId: string } }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // verify trainer owns student
  const trainerRes = await supabaseAdmin
    .from('students')
    .select('trainer_id')
    .eq('id', params.studentId)
    .single()
  if (trainerRes.error) {
    return NextResponse.json({ error: trainerRes.error.message }, { status: 500 })
  }
  const ownerCheck = await supabaseAdmin
    .from('personal_trainers')
    .select('id')
    .eq('id', trainerRes.data.trainer_id)
    .eq('clerk_user_id', userId)
    .single()
  if (ownerCheck.error || !ownerCheck.data) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { data, error } = await supabaseAdmin
    .from('plans')
    .select('*')
    .eq('student_id', params.studentId)
    .order('inserted_at', { ascending: true })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ plans: data }, { status: 200 })
}

export async function POST(
  request: Request,
  { params }: { params: { studentId: string } }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { notes } = body
  // verify trainer owns student
  const trainerRes = await supabaseAdmin
    .from('students')
    .select('trainer_id')
    .eq('id', params.studentId)
    .single()
  if (trainerRes.error) {
    return NextResponse.json({ error: trainerRes.error.message }, { status: 500 })
  }
  const ownerCheck = await supabaseAdmin
    .from('personal_trainers')
    .select('id')
    .eq('id', trainerRes.data.trainer_id)
    .eq('clerk_user_id', userId)
    .single()
  if (ownerCheck.error || !ownerCheck.data) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const lastPlanRes = await supabaseAdmin
    .from('plans')
    .select('id')
    .eq('student_id', params.studentId)
    .order('inserted_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  const previous_plan_id = lastPlanRes.data?.id || null

  const { data, error } = await supabaseAdmin
    .from('plans')
    .insert({ student_id: params.studentId, notes, previous_plan_id })
    .select()
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ plan: data }, { status: 200 })
}
