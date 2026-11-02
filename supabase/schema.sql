-- Mini Arcade database setup.
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
--
-- Security model
--  * Emails and passwords live only in Supabase's private auth.users table (passwords are hashed).
--  * public.profiles holds just id + username, so the leaderboard never exposes emails.
--  * Row Level Security (RLS) is on for every table:
--      - anyone can READ profiles and scores (needed for the public leaderboard)
--      - a signed-in user can only INSERT scores for themselves
--      - nobody can UPDATE or DELETE rows through the API (no policies = denied)
--  * Score values are range-checked and rate-limited to make fake scores harder.

-- ───────────────────────── profiles ─────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  created_at timestamptz not null default now(),
  constraint username_format check (username ~ '^[A-Za-z0-9_]{3,20}$')
);

-- Usernames are unique regardless of upper/lower case.
create unique index if not exists profiles_username_lower_idx on public.profiles (lower(username));

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- Create a profile automatically when someone signs up.
-- The username comes from the sign-up form (stored in user metadata).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data ->> 'username');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Lets the sign-up form check a username before creating the account.
create or replace function public.username_available(name text)
returns boolean
language sql
stable
set search_path = ''
as $$
  select not exists (select 1 from public.profiles where lower(username) = lower(name));
$$;

-- ───────────────────────── scores ─────────────────────────
create table if not exists public.scores (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  game text not null,
  score integer not null,
  created_at timestamptz not null default now(),
  -- Reject values that are impossible in each game.
  constraint valid_score check (
       (game = 'guess-number' and score between 1 and 7)       -- tries used (lower is better)
    or (game = 'memory'       and score between 8 and 500)     -- moves (lower is better)
    or (game = 'reaction'     and score between 80 and 5000)   -- milliseconds (lower is better)
    or (game = 'typing'       and score between 1 and 250)     -- words per minute
    or (game = 'whack-a-mole' and score between 1 and 80)      -- moles hit in 30 s
    or (game = 'rps'          and score = 1)                   -- one match won
    or (game = 'tic-tac-toe'  and score = 1)                   -- one round won vs computer
  )
);

create index if not exists scores_game_user_idx on public.scores (game, user_id);
-- Covers the user_id foreign key and the rate-limit check below.
create index if not exists scores_user_created_idx on public.scores (user_id, created_at desc);

alter table public.scores enable row level security;

drop policy if exists "Scores are viewable by everyone" on public.scores;
create policy "Scores are viewable by everyone"
  on public.scores for select
  using (true);

drop policy if exists "Users can add their own scores" on public.scores;
create policy "Users can add their own scores"
  on public.scores for insert
  to authenticated
  with check (user_id = (select auth.uid()));

-- Server sets the owner and time itself, and limits how often one account can submit.
create or replace function public.prepare_score()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.user_id := auth.uid();
  new.created_at := now();
  if exists (
    select 1 from public.scores
    where user_id = new.user_id and created_at > now() - interval '1 second'
  ) then
    raise exception 'Too many results in a short time';
  end if;
  return new;
end;
$$;

drop trigger if exists scores_prepare on public.scores;
create trigger scores_prepare
  before insert on public.scores
  for each row execute function public.prepare_score();

-- ───────────────────────── leaderboard ─────────────────────────
-- One row per player per game: their best result (or total wins) and their rank.
create or replace function public.ranked_scores()
returns table (game text, user_id uuid, username text, value bigint, plays bigint, rank bigint)
language sql
stable
set search_path = ''
as $$
  with per_user as (
    select
      s.game,
      s.user_id,
      (case
        when s.game in ('rps', 'tic-tac-toe') then count(*)
        when s.game in ('guess-number', 'memory', 'reaction') then min(s.score)
        else max(s.score)
      end)::bigint as value,
      count(*) as plays
    from public.scores s
    group by s.game, s.user_id
  )
  select
    pu.game,
    pu.user_id,
    p.username,
    pu.value,
    pu.plays,
    rank() over (
      partition by pu.game
      order by case when pu.game in ('guess-number', 'memory', 'reaction') then pu.value else -pu.value end
    ) as rank
  from per_user pu
  join public.profiles p on p.id = pu.user_id;
$$;

create or replace function public.get_leaderboard(game_id text, max_rows int default 50)
returns table (user_id uuid, username text, value bigint, rank bigint)
language sql
stable
set search_path = ''
as $$
  select r.user_id, r.username, r.value, r.rank
  from public.ranked_scores() r
  where r.game = game_id
  order by r.rank, r.username
  limit least(max_rows, 100);
$$;

-- The signed-in player's result and rank in every game they've played.
create or replace function public.get_my_ranks()
returns table (game text, value bigint, plays bigint, rank bigint)
language sql
stable
set search_path = ''
as $$
  select r.game, r.value, r.plays, r.rank
  from public.ranked_scores() r
  where r.user_id = auth.uid();
$$;

-- ───────────────────────── account deletion ─────────────────────────
-- Deletes the signed-in user. Their profile and scores are removed too (on delete cascade).
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

-- Only signed-in users may call the account functions.
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
revoke execute on function public.get_my_ranks() from public, anon;
grant execute on function public.get_my_ranks() to authenticated;
-- The trigger function must never be called directly.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
