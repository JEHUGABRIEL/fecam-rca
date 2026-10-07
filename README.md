# FECAM — Fédération Centrafricaine de Musique

Site public et back-office de la FECAM : agenda, actualités, dernières sorties, Radio FECAM,
adhésions. React + Vite, fonctions Vercel, base Neon (Postgres), images sur Vercel Blob.

## Démarrer

```bash
npm install
npm run dev          # site seul, avec les données d'exemple de src/data
vercel env pull .env.local && vercel dev   # site + API + back-office
```

## Base de données

```bash
psql "$DATABASE_URL" -f db/schema.sql   # crée les tables (relançable sans risque)
node scripts/seed.mjs                    # remplit les tables vides avec le contenu de src/data
```

## Back-office

`/admin` — protégé par le mot de passe `ADMIN_PASSWORD`. Variables à définir sur Vercel :
voir `.env.example`.
