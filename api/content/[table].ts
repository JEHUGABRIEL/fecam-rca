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
    // Cache CDN court : le contenu modifié dans le back-office apparaît en moins d'une minute
    return json(rows, 200, { 'cache-control': 'public, s-maxage=30, stale-while-revalidate=300' });
  } catch (err) {
    return serverError(err);
  }
}
