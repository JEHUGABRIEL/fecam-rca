// Remplit la base avec le contenu de /src/data (événements, actualités, artistes, sorties, radio).
// Les lignes existantes (même id) sont conservées : le script peut être relancé sans risque.
// Usage : DATABASE_URL=… node scripts/seed.mjs
//     ou : node scripts/seed.mjs --sql | psql "$DATABASE_URL"   (si l'API HTTP de Neon est injoignable)
import { buildSync } from 'esbuild';
import { neon } from '@neondatabase/serverless';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const sqlOnly = process.argv.includes('--sql');
if (!sqlOnly && !process.env.DATABASE_URL) throw new Error('DATABASE_URL manquante');
const sql = sqlOnly ? null : neon(process.env.DATABASE_URL);

// Littéral SQL pour le mode --sql
const literal = (v) =>
v === null || v === undefined ? 'null' :
typeof v === 'boolean' ? String(v) :
typeof v === 'number' ? String(v) :
Array.isArray(v) ? `array[${v.map(Number).join(',')}]::int[]` :
`'${String(v).replace(/'/g, "''")}'`;

// Les données sont en TypeScript : on les transpile en un module ESM temporaire
const dir = mkdtempSync(join(tmpdir(), 'fecam-seed-'));
const entry = join(dir, 'entry.ts');
writeFileSync(
  entry,
  ['events', 'news', 'artists', 'releases', 'radioSchedule'].
  map((m) => `export * from ${JSON.stringify(join(process.cwd(), 'src/data', m))};`).
  join('\n')
);
const out = join(dir, 'data.mjs');
buildSync({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' });
const data = await import(pathToFileURL(out).href);

async function seed(table, rows, map) {
  if (sqlOnly) console.log('begin;');
  for (const row of rows) {
    const values = map(row);
    const cols = Object.keys(values);
    const head = `insert into ${table} (${cols.map((c) => `"${c}"`).join(', ')}) values`;
    if (sqlOnly) {
      console.log(`${head} (${cols.map((c) => literal(values[c])).join(', ')}) on conflict (id) do nothing;`);
    } else {
      await sql.query(`${head} (${cols.map((_, i) => `$${i + 1}`).join(', ')}) on conflict (id) do nothing`, cols.map((c) => values[c] ?? null));
    }
  }
  if (sqlOnly) console.log('commit;');else
  console.error(`${table} : ${rows.length} lignes traitées`);
}

await seed('events', data.events, (e) => ({
  id: e.id, title: e.title, category: e.category, date: e.date, end_date: e.endDate, time: e.time,
  venue: e.venue, city: e.city, price: e.price, image: e.image, summary: e.summary, description: e.description
}));
await seed('news', data.news, (n) => ({ id: n.id, title: n.title, date: n.date, category: n.category, excerpt: n.excerpt, image: n.image }));
await seed('artists', data.artists, (a) => ({
  id: a.id, name: a.name, kind: a.kind, genre: a.genre, city: a.city, image: a.image, bio: a.bio, featured: Boolean(a.featured)
}));
await seed('releases', data.releases, (r) => ({
  id: r.id, title: r.title, artist: r.artist, cover: r.cover, release_date: r.releaseDate, youtube_url: r.youtubeUrl, spotify_url: r.spotifyUrl
}));
await seed('radio_shows', data.radioShows, (s) => ({
  id: s.id, days: s.days, start: s.start, end: s.end, title: s.title, host: s.host, description: s.description
}));
