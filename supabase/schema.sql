-- Wildcard: one row per species, harvested from iNaturalist by
-- `npm run seed`. Run this once in the Supabase SQL editor.

create table if not exists public.animals (
  taxon_id bigint primary key,
  name text not null,
  scientific_name text not null,
  taxon_group text not null,
  summary text not null default '',
  conservation_status text,
  observation_count integer,
  photo_url text not null,
  photo_attribution text not null,
  inaturalist_url text not null,
  updated_at timestamptz not null default now()
);

-- Explicit grants, so this works even on projects that don't expose new
-- tables to the API automatically. Visitors can only read; the seed
-- script's service role can write.
grant select on public.animals to anon, authenticated;
grant all on public.animals to service_role;

-- The site only ever reads, and the data is public, so anonymous visitors
-- get select and nothing else. Writes go through the seed script, which
-- uses the service role key and bypasses these policies.
alter table public.animals enable row level security;

drop policy if exists "Animals are readable by everyone" on public.animals;
create policy "Animals are readable by everyone"
  on public.animals for select
  to anon, authenticated
  using (true);

-- Picking a random row. `order by random()` reads the whole table, which is
-- fine at a few thousand rows and keeps the query honest and simple.
create or replace function public.random_animal(exclude_ids bigint[] default '{}')
returns setof public.animals
language sql
stable
as $$
  select *
  from public.animals
  where not (taxon_id = any(exclude_ids))
  order by random()
  limit 1;
$$;

grant execute on function public.random_animal(bigint[]) to anon, authenticated;
