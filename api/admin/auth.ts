import { query } from '../_lib/db.js';
import { error, json, readJson, serverError } from '../_lib/http.js';
import { DUMMY_HASH, verifyPassword } from '../_lib/password.js';
import { allow, clientIp, forbiddenOrigin, resetLimit, sameOrigin, tooMany } from '../_lib/security.js';
import { clearedCookie, currentAdmin, sessionCookie } from '../_lib/session.js';

const noStore = { 'cache-control': 'no-store' };

// GET : session en cours (et compte connecté)
export async function GET(request: Request) {
  try {
    const user = await currentAdmin(request);
    return json({ authenticated: Boolean(user), user }, 200, noStore);
  } catch (err) {
    return serverError(err);
  }
}

// POST { email, password } : ouvre une session
export async function POST(request: Request) {
  if (!sameOrigin(request)) return forbiddenOrigin();
  const body = await readJson(request);
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase().slice(0, 200) : '';
  const password = typeof body?.password === 'string' ? body.password.slice(0, 200) : '';
  if (!email || !password) return error(400, 'Email et mot de passe requis.');

  try {
    // 10 essais par IP et 5 par compte toutes les 15 minutes
    const ipKey = `login-ip:${clientIp(request)}`;
    const emailKey = `login-email:${email}`;
    if (!(await allow(ipKey, 10, 900)) || !(await allow(emailKey, 5, 900))) return tooMany();

    const [user] = await query<{id: string;email: string;name: string;password_hash: string;session_version: number;}>(
      'select id, email, name, password_hash, session_version from admin_users where email = $1',
      [email]
    );
    // Vérifie une empreinte même si le compte n'existe pas (temps de réponse identique)
    const ok = await verifyPassword(password, user?.password_hash ?? DUMMY_HASH);
    if (!user || !ok) return error(401, 'Email ou mot de passe incorrect.');

    await resetLimit(emailKey);
    await query('update admin_users set last_login_at = now() where id = $1', [user.id]);
    return json(
      { authenticated: true, user: { id: user.id, email: user.email, name: user.name } },
      200,
      { ...noStore, 'set-cookie': sessionCookie(user.id, user.session_version) }
    );
  } catch (err) {
    return serverError(err);
  }
}

// DELETE : ferme la session
export function DELETE(request: Request) {
  if (!sameOrigin(request)) return forbiddenOrigin();
  return json({ authenticated: false }, 200, { ...noStore, 'set-cookie': clearedCookie() });
}
