-- SQL schema for storing trainer students
create table if not exists students (
    id uuid primary key default uuid_generate_v4(),
    trainer_id uuid references personal_trainers(id) on delete cascade,
    full_name text not null,
    email text not null,
    type text,
    inserted_at timestamp with time zone default timezone('utc', now()),
    updated_at timestamp with time zone default timezone('utc', now())
);

alter table students enable row level security;

create policy "Allow trainer" on students
  for all
  using (trainer_id in (
    select id from personal_trainers
    where clerk_user_id = auth.jwt()->>'sub'
  ))
  with check (trainer_id in (
    select id from personal_trainers
    where clerk_user_id = auth.jwt()->>'sub'
  ));
