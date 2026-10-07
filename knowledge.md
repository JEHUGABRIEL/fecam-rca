# FECAM — Project knowledge

Public website + admin back-office for **FECAM (Fédération Centrafricaine de Musique)**, a
music federation in Bangui. It publishes events, news, latest releases, featured artists and a
radio schedule, streams Radio FECAM, and collects membership requests, contact messages,
event reservations, radio dedications and newsletter sign-ups. UI and content are in
**French**; code identifiers are English.

## Stack
React 18 + TypeScript + Vite 5, React Router 6, Tailwind CSS 3, framer-motion, lucide-react.
Backend: Vercel serverless functions in `api/` (Web `Request`/`Response` handlers) on
**Neon Postgres** (`@neondatabase/serverless`), images in **Vercel Blob**.

## Commands
- Install: `npm install`
- Front only: `npm run dev` (Vite; `/api` is absent, so the site uses the static fallback data)
- Full stack locally: `vercel dev` (needs `vercel env pull .env.local` first)
- Build: `npm run build`
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit -p .` (front) and `npx tsc -p tsconfig.api.json` (API) — **no tests.**
- Database: `psql "$DATABASE_URL" -f db/schema.sql` (idempotent), then `node scripts/seed.mjs`
  (fills only empty tables from `src/data`).

## Architecture
- `api/_lib/tables.ts` — **whitelist** of tables/columns exposed by the API, their SELECT lists
  (public ones alias snake_case to the camelCase TS types, e.g. `end_date as "endDate"`), and
  value coercion/validation. No identifier from a request ever reaches SQL.
- `api/content/[table].ts` GET public content · `api/submit/[table].ts` POST public forms
  (honeypot field `website`) · `api/settings.ts` GET public / PUT admin (social links) ·
  `api/admin/auth.ts` login/session/logout · `api/admin/[table].ts` admin CRUD ·
  `api/admin/upload.ts` image upload to Blob.
- Admin auth: single password `ADMIN_PASSWORD`; stateless HMAC cookie `fecam_admin` signed with
  `ADMIN_SESSION_SECRET` (same pattern as the owner's portfolio).
- `src/hooks/useCollection.ts` reads `/api/content/:table` and **falls back to `src/data`** when
  the API is unreachable or answers non-JSON, so the public site always renders.
- `src/hooks/useSubmit.ts` posts public forms; `src/hooks/useAdminTable.ts` admin CRUD (401 →
  `expire()` → redirect to `/admin/connexion`).
- `src/admin/AdminCrudPage.tsx` generic editor (side panel, image upload field);
  `src/admin/InboxPage.tsx` generic list for public submissions with status workflow.
- `db/schema.sql` — all tables and check constraints.

## Configuration (Vercel env, all environments)
`DATABASE_URL` (Neon integration), `BLOB_READ_WRITE_TOKEN` (Blob store), `ADMIN_PASSWORD`,
`ADMIN_SESSION_SECRET` (≥ 32 chars).

## Conventions & gotchas
- **Design tokens** in `tailwind.config.js`: `fecam-black #1A1612`, `fecam-orange #E8742F`,
  `fecam-blue #2B36B0`, `fecam-paper #F7F3EC`, `fecam-sand #EEE6D9`, `fecam-clay #A2593A`.
  Fonts: `font-poster` (Anton, always uppercase), `font-display` (Bricolage Grotesque),
  `font-serif` (Fraunces italic accents), `font-sans` (Instrument Sans). Shared classes
  `.btn-primary/.btn-dark/.btn-ghost`, `.link-draw`, `.img-zoom` live in `src/index.css`.
- Colours are accents only (no large orange/blue fills), separators are 10 % hairlines.
- Motion: `src/components/Reveal.tsx` (`Reveal`, `RevealGroup` + `revealItem`, `MaskedLines`)
  with the `easeOut` curve; `MotionConfig reducedMotion="user"` disables it when asked.
- **`src/index.css` import order is load-bearing** — font `@import` above the Tailwind imports.
- Dates are ISO strings (`YYYY-MM-DD`, selected with `::text`); event times are free text
  (`18h00`); radio `start`/`end` are `HH:MM` text, `24:00` = midnight; `days` uses `Date.getDay()`.
- UI copy is French — keep new strings French and accessible.

## Workspace gotcha
This folder is its own git repo (remote `JEHUGABRIEL/fecam-rca`). The enclosing repository at
`/home/pkf` is unrelated: always run git commands from this folder.
