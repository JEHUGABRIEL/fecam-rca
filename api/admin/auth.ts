import { error, json, readJson, serverError } from '../_lib/http.js';
import { checkPassword, clearedCookie, isAuthenticated, sessionCookie } from '../_lib/session.js';

// GET : la session est-elle valide ?
export function GET(request: Request) {
  return json({ authenticated: isAuthenticated(request) }, 200, { 'cache-control': 'no-store' });
}

// POST { password } : ouvre une session
export async function POST(request: Request) {
  const body = await readJson(request);
  const password = typeof body?.password === 'string' ? body.password : '';
  try {
    if (!password || !checkPassword(password)) {
      // Ralentit les essais en rafale
      await new Promise((r) => setTimeout(r, 800));
      return error(401, 'Mot de passe incorrect.');
    }
    return json({ authenticated: true }, 200, { 'set-cookie': sessionCookie(), 'cache-control': 'no-store' });
  } catch (err) {
    return serverError(err);
  }
}

// DELETE : ferme la session
export function DELETE() {
  return json({ authenticated: false }, 200, { 'set-cookie': clearedCookie() });
}
