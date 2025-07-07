import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const trainerRes = await supabaseAdmin
    .from('personal_trainers')
    .select('id')
    .eq('clerk_user_id', userId)
    .single();

  if (trainerRes.error) {
    return NextResponse.json({ error: trainerRes.error.message }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from('students')
    .select('*')
    .eq('trainer_id', trainerRes.data.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ students: data }, { status: 200 });
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { full_name, email, type, age, description, avatar_url, schedule } = body
  const trainerRes = await supabaseAdmin
    .from('personal_trainers')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (trainerRes.error) {
    return NextResponse.json({ error: trainerRes.error.message }, { status: 500 })
  }

  const { data, error } = await supabaseAdmin
    .from('students')
    .insert({
      trainer_id: trainerRes.data.id,
      full_name,
      email,
      type,
      age,
      description,
      avatar_url,
      schedule,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ student: data }, { status: 200 })
}
