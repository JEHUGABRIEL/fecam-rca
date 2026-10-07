import { query } from './_lib/db.js';
import { error, json, readJson, serverError } from './_lib/http.js';
import { asAdmin } from './_lib/guard.js';
import { coerce } from './_lib/tables.js';

// Réglages éditables : liens des réseaux sociaux affichés dans le pied de page
export const settingKeys = ['facebook', 'instagram', 'youtube', 'tiktok', 'spotify', 'whatsapp'] as const;

async function readSettings() {
  const rows = await query<{ key: string; value: string }>('select key, value from site_settings');
  return Object.fromEntries(settingKeys.map((k) => [k, rows.find((r) => r.key === k)?.value ?? '']));
}

// GET /api/settings — public
export async function GET() {
  try {
    return json(await readSettings(), 200, { 'cache-control': 'public, max-age=0, s-maxage=10, must-revalidate' });
  } catch (err) {
    return serverError(err);
  }
}

// PUT /api/settings — admin : { facebook: "https://…", … }
export function PUT(request: Request) {
  return asAdmin(request, async () => {
    const body = await readJson(request);
    if (!body) return error(400, 'Requête invalide');
    for (const key of settingKeys) {
      if (!(key in body)) continue;
      const value = (coerce({ name: key, type: 'url', nullable: true }, body[key]) as string | null) ?? '';
      await query(
        'insert into site_settings (key, value) values ($1, $2) on conflict (key) do update set value = excluded.value',
        [key, value]
      );
    }
    return json(await readSettings());
  });
}
