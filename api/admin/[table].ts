import { query } from '../_lib/db.js';
import { error, json, lastSegment, readJson, serverError } from '../_lib/http.js';
import { isAuthenticated } from '../_lib/session.js';
import { coerce, ident, tables, ValidationError } from '../_lib/tables.js';

// /api/admin/:table — lecture et édition de toutes les tables, réservé à l'admin connecté.
async function handle(request: Request, run: (name: string) => Promise<Response>) {
  if (!isAuthenticated(request)) return error(401, 'Session expirée, reconnectez-vous.');
  const name = lastSegment(request);
  if (!tables[name]) return error(404, 'Table inconnue');
  try {
    return await run(name);
  } catch (err) {
    if (err instanceof ValidationError) return error(400, err.message);
    // Violation de contrainte Postgres (valeur hors liste, format d'heure…)
    if ((err as { code?: string }).code === '23514') return error(400, 'Valeur refusée : vérifiez les champs.');
    return serverError(err);
  }
}

function valuesFrom(name: string, body: Record<string, unknown>, partial: boolean) {
  const values: Record<string, unknown> = {};
  for (const col of tables[name].columns) {
    if (partial && !(col.name in body)) continue;
    const v = coerce(col, body[col.name]);
    if (col.required && (v === null || v === '')) throw new ValidationError(`Le champ « ${col.name} » est obligatoire.`);
    values[col.name] = v;
  }
  return values;
}

const idOf = (request: Request) => new URL(request.url).searchParams.get('id');

export function GET(request: Request) {
  return handle(request, async (name) => {
    const def = tables[name];
    return json(await query(`select ${def.adminSelect} from ${name} order by ${def.order}`), 200, { 'cache-control': 'no-store' });
  });
}

export function POST(request: Request) {
  return handle(request, async (name) => {
    const body = await readJson(request);
    if (!body) return error(400, 'Requête invalide');
    const values = valuesFrom(name, body, false);
    const cols = Object.keys(values);
    if (cols.length === 0) return error(400, 'Rien à enregistrer');
    const [row] = await query(
      `insert into ${name} (${cols.map(ident).join(', ')}) values (${cols.map((_, i) => `$${i + 1}`).join(', ')}) returning id`,
      cols.map((c) => values[c])
    );
    return json(row, 201);
  });
}

export function PATCH(request: Request) {
  return handle(request, async (name) => {
    const id = idOf(request);
    const body = await readJson(request);
    if (!id || !body) return error(400, 'Requête invalide');
    const values = valuesFrom(name, body, true);
    const cols = Object.keys(values);
    if (cols.length === 0) return error(400, 'Rien à modifier');
    const rows = await query(
      `update ${name} set ${cols.map((c, i) => `${ident(c)} = $${i + 1}`).join(', ')} where id = $${cols.length + 1} returning id`,
      [...cols.map((c) => values[c]), id]
    );
    return rows.length ? json(rows[0]) : error(404, 'Élément introuvable');
  });
}

export function DELETE(request: Request) {
  return handle(request, async (name) => {
    const id = idOf(request);
    if (!id) return error(400, 'Identifiant manquant');
    const rows = await query(`delete from ${name} where id = $1 returning id`, [id]);
    return rows.length ? json({ ok: true }) : error(404, 'Élément introuvable');
  });
}
