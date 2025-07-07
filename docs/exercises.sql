-- SQL schema for storing exercises created by trainers
create table if not exists exercises (
    id uuid primary key default uuid_generate_v4(),
    trainer_id uuid references personal_trainers(id) on delete cascade,
    name text not null,
    description text,
    icon text,
    inserted_at timestamp with time zone default timezone('utc', now()),
    updated_at timestamp with time zone default timezone('utc', now())
);

alter table exercises enable row level security;

create policy "Allow trainer" on exercises
  for all
  using (trainer_id in (
    select id from personal_trainers
    where clerk_user_id = auth.jwt()->>'sub'
  ))
  with check (trainer_id in (
    select id from personal_trainers
    where clerk_user_id = auth.jwt()->>'sub'
  ));
