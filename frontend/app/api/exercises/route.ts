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
    .from('exercises')
    .select('*')
    .eq('trainer_id', trainerRes.data.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ exercises: data }, { status: 200 });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { name, description, icon } = body;
  const trainerRes = await supabaseAdmin
    .from('personal_trainers')
    .select('id')
    .eq('clerk_user_id', userId)
    .single();
  if (trainerRes.error) {
    return NextResponse.json({ error: trainerRes.error.message }, { status: 500 });
  }
  const { data, error } = await supabaseAdmin
    .from('exercises')
    .insert({ trainer_id: trainerRes.data.id, name, description, icon })
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ exercise: data }, { status: 200 });
}
