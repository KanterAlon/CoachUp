-- SQL schema for storing class plans for each student
create table if not exists plans (
    id uuid primary key default uuid_generate_v4(),
    student_id uuid references students(id) on delete cascade,
    previous_plan_id uuid references plans(id),
    notes text,
    inserted_at timestamp with time zone default timezone('utc', now()),
    updated_at timestamp with time zone default timezone('utc', now())
);

alter table plans enable row level security;

create policy "Trainer access" on plans
  for all
  using (student_id in (
    select students.id from students
    join personal_trainers on students.trainer_id = personal_trainers.id
    where personal_trainers.clerk_user_id = auth.jwt()->>'sub'
  ))
  with check (student_id in (
    select students.id from students
    join personal_trainers on students.trainer_id = personal_trainers.id
    where personal_trainers.clerk_user_id = auth.jwt()->>'sub'
  ));
