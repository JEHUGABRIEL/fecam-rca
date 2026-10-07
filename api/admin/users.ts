import { query } from '../_lib/db.js';
import { asAdmin } from '../_lib/guard.js';
import { error, json, readJson } from '../_lib/http.js';
import { hashPassword, passwordProblem } from '../_lib/password.js';

// /api/admin/users — comptes administrateurs (les empreintes de mot de passe ne sortent jamais)

export function GET(request: Request) {
  return asAdmin(request, async () =>
  json(
    await query('select id, email, name, created_at::text as created_at, last_login_at::text as last_login_at from admin_users order by created_at'),
    200,
    { 'cache-control': 'no-store' }
  )
  );
}

// POST { email, name, password }
export function POST(request: Request) {
  return asAdmin(request, async () => {
    const body = await readJson(request);
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 120) : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return error(400, 'Adresse e-mail invalide.');
    const problem = passwordProblem(password);
    if (problem) return error(400, problem);
    const [row] = await query('insert into admin_users (email, name, password_hash) values ($1, $2, $3) returning id', [
    email,
    name,
    await hashPassword(password)]
    );
    return json(row, 201);
  });
}

// DELETE ?id= — impossible de supprimer son propre compte (on garde toujours un admin)
export function DELETE(request: Request) {
  return asAdmin(request, async (admin) => {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return error(400, 'Identifiant manquant');
    if (id === admin.id) return error(400, 'Vous ne pouvez pas supprimer votre propre compte.');
    const rows = await query('delete from admin_users where id = $1 returning id', [id]);
    return rows.length ? json({ ok: true }) : error(404, 'Compte introuvable');
  });
}
