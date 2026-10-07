-- Schéma FECAM (Postgres / Neon). Idempotent : peut être relancé sans risque.
-- Appliquer avec : psql "$DATABASE_URL" -f db/schema.sql

-- ─────────────────────────────── Événements ───────────────────────────────
create table if not exists events (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  category text not null check (category in ('Concert','Festival','Formation','Concours','Conférence')),
  date date not null,
  end_date date,
  time text not null,
  venue text not null,
  city text not null,
  price text not null default 'Gratuit',
  image text not null default '',
  summary text not null default '',
  description text not null default '',
  created_at timestamptz not null default now()
);

-- ─────────────────────────────── Actualités ────────────────────────────────
create table if not exists news (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  date date not null,
  category text not null,
  excerpt text not null,
  image text not null default '',
  created_at timestamptz not null default now()
);

-- ─────────────────────────────── Artistes ──────────────────────────────────
create table if not exists artists (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  kind text not null check (kind in ('Artiste','Groupe')),
  genre text not null,
  city text not null,
  image text,
  bio text not null default '',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ───────────────────────────── Dernières sorties ───────────────────────────
create table if not exists releases (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  artist text not null,
  cover text not null default '',
  release_date date not null,
  youtube_url text,
  spotify_url text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────── Grille radio ──────────────────────────────
-- Heures au format « HH:MM » ; « 24:00 » marque la fin de journée.
create table if not exists radio_shows (
  id text primary key default gen_random_uuid()::text,
  days int[] not null,
  start text not null check (start ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  "end" text not null check ("end" ~ '^(([01][0-9]|2[0-3]):[0-5][0-9]|24:00)$'),
  title text not null,
  host text not null,
  description text not null default ''
);

-- ─────────────────────────────── Réglages du site ──────────────────────────
-- Paires clé / valeur (liens des réseaux sociaux, etc.), éditables dans le back-office.
create table if not exists site_settings (
  key text primary key,
  value text not null default ''
);

-- ───────────────────── Envois du public (lus dans le back-office) ──────────
create table if not exists membership_requests (
  id text primary key default gen_random_uuid()::text,
  plan text not null,
  name text not null,
  genre text,
  phone text not null,
  email text,
  city text not null,
  presentation text,
  status text not null default 'nouveau' check (status in ('nouveau','contacté','validé','refusé')),
  created_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'non lu' check (status in ('non lu','lu','traité')),
  created_at timestamptz not null default now()
);

create table if not exists reservations (
  id text primary key default gen_random_uuid()::text,
  event_id text references events(id) on delete set null,
  event_title text not null,
  name text not null,
  phone text not null,
  seats int not null default 1 check (seats between 1 and 10),
  status text not null default 'nouvelle' check (status in ('nouvelle','confirmée','annulée')),
  created_at timestamptz not null default now()
);

create table if not exists dedications (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  city text,
  song text,
  message text not null,
  status text not null default 'nouvelle' check (status in ('nouvelle','diffusée','écartée')),
  created_at timestamptz not null default now()
);

create table if not exists newsletter_subscribers (
  id text primary key default gen_random_uuid()::text,
  email text not null unique,
  created_at timestamptz not null default now()
);
