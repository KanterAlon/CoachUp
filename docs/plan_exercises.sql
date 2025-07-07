-- SQL schema for linking exercises to a plan
create table if not exists plan_exercises (
    id uuid primary key default uuid_generate_v4(),
    plan_id uuid references plans(id) on delete cascade,
    exercise_id uuid references exercises(id) on delete cascade,
    sets integer,
    reps integer,
    inserted_at timestamp with time zone default timezone('utc', now()),
    updated_at timestamp with time zone default timezone('utc', now())
);

alter table plan_exercises enable row level security;

create policy "Trainer access" on plan_exercises
  for all
  using (plan_id in (
    select plans.id from plans
    join students on plans.student_id = students.id
    join personal_trainers on students.trainer_id = personal_trainers.id
    where personal_trainers.clerk_user_id = auth.jwt()->>'sub'
  ))
  with check (plan_id in (
    select plans.id from plans
    join students on plans.student_id = students.id
    join personal_trainers on students.trainer_id = personal_trainers.id
    where personal_trainers.clerk_user_id = auth.jwt()->>'sub'
  ));
