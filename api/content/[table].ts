import { query } from '../_lib/db.js';
import { error, json, lastSegment, serverError } from '../_lib/http.js';
import { tables } from '../_lib/tables.js';

// GET /api/content/:table — contenu public du site (événements, actualités, artistes, sorties, radio)
export async function GET(request: Request) {
  const name = lastSegment(request);
  const def = tables[name];
  if (!def?.publicSelect) return error(404, 'Contenu inconnu');
  try {
    const rows = await query(`select ${def.publicSelect} from ${name} order by ${def.order}`);
    // Cache CDN de 10 s, sans resservir de version périmée : une modification faite dans le
    // back-office apparaît sur le site en 10 secondes au plus
    return json(rows, 200, { 'cache-control': 'public, max-age=0, s-maxage=10, must-revalidate' });
  } catch (err) {
    return serverError(err);
  }
}
