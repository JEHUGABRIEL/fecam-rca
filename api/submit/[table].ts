import { query } from '../_lib/db.js';
import { error, json, lastSegment, readJson, serverError } from '../_lib/http.js';
import { coerce, ident, publicRequired, tables, ValidationError } from '../_lib/tables.js';

// POST /api/submit/:table — formulaires publics (adhésion, contact, réservation, dédicace, newsletter)
export async function POST(request: Request) {
  const name = lastSegment(request);
  const def = tables[name];
  if (!def?.publicInsert) return error(404, 'Formulaire inconnu');

  const body = await readJson(request);
  if (!body) return error(400, 'Requête invalide');
  // Champ piège invisible pour les humains : rempli = robot, on fait semblant d'accepter
  if (body.website) return json({ ok: true }, 201);

  try {
    const values: Record<string, unknown> = {};
    for (const col of def.publicInsert) values[col] = coerce({ name: col, max: col === 'message' || col === 'presentation' ? 2000 : 200 }, body[col]);
    for (const col of publicRequired[name] ?? []) {
      if (values[col] === null) return error(400, 'Merci de remplir les champs obligatoires.');
    }
    if (typeof values.email === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      return error(400, 'Adresse e-mail invalide.');
    }

    if (name === 'reservations') {
      // Le titre fait foi côté serveur quand l'événement existe en base
      const [event] = await query<{ title: string }>('select title from events where id = $1', [values.event_id]);
      if (event) values.event_title = event.title;else
      values.event_id = null;
    }

    const cols = Object.keys(values);
    const conflict = name === 'newsletter_subscribers' ? ' on conflict (email) do nothing' : '';
    await query(
      `insert into ${name} (${cols.map(ident).join(', ')}) values (${cols.map((_, i) => `$${i + 1}`).join(', ')})${conflict}`,
      cols.map((c) => values[c])
    );
    return json({ ok: true }, 201);
  } catch (err) {
    if (err instanceof ValidationError) return error(400, err.message);
    return serverError(err);
  }
}
