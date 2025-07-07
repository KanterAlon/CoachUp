-- SQL schema for storing trainer profiles
create table if not exists personal_trainers (
    id uuid primary key default uuid_generate_v4(),
    clerk_user_id text unique not null,
    full_name text not null,
    age integer,
    city text,
    inserted_at timestamp with time zone default timezone('utc', now()),
    updated_at timestamp with time zone default timezone('utc', now())
);

alter table personal_trainers enable row level security;

create policy "Allow owner" on personal_trainers
  for all
  using (clerk_user_id = auth.jwt()->>'sub')
  with check (clerk_user_id = auth.jwt()->>'sub');
