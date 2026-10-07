import { query } from './_lib/db.js';
import { error, json, readJson, serverError } from './_lib/http.js';
import { isAuthenticated } from './_lib/session.js';
import { coerce, ValidationError } from './_lib/tables.js';

// Réglages éditables : liens des réseaux sociaux affichés dans le pied de page
export const settingKeys = ['facebook', 'instagram', 'youtube', 'tiktok', 'spotify', 'whatsapp'] as const;

async function readSettings() {
  const rows = await query<{ key: string; value: string }>('select key, value from site_settings');
  return Object.fromEntries(settingKeys.map((k) => [k, rows.find((r) => r.key === k)?.value ?? '']));
}

// GET /api/settings — public
export async function GET() {
  try {
    return json(await readSettings(), 200, { 'cache-control': 'public, s-maxage=30, stale-while-revalidate=300' });
  } catch (err) {
    return serverError(err);
  }
}

// PUT /api/settings — admin : { facebook: "https://…", … }
export async function PUT(request: Request) {
  if (!isAuthenticated(request)) return error(401, 'Session expirée, reconnectez-vous.');
  const body = await readJson(request);
  if (!body) return error(400, 'Requête invalide');
  try {
    for (const key of settingKeys) {
      if (!(key in body)) continue;
      const value = (coerce({ name: key, type: 'url' }, body[key]) as string | null) ?? '';
      await query(
        'insert into site_settings (key, value) values ($1, $2) on conflict (key) do update set value = excluded.value',
        [key, value]
      );
    }
    return json(await readSettings());
  } catch (err) {
    if (err instanceof ValidationError) return error(400, err.message);
    return serverError(err);
  }
}
