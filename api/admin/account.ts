import { query } from '../_lib/db.js';
import { asAdmin } from '../_lib/guard.js';
import { error, json, readJson } from '../_lib/http.js';
import { hashPassword, passwordProblem, verifyPassword } from '../_lib/password.js';
import { allow, tooMany } from '../_lib/security.js';
import { sessionCookie } from '../_lib/session.js';

// PATCH { name?, currentPassword?, newPassword? } — modifie son propre compte.
// Un nouveau mot de passe déconnecte toutes les autres sessions (version incrémentée).
export function PATCH(request: Request) {
  return asAdmin(request, async (admin) => {
    const body = await readJson(request);
    if (!body) return error(400, 'Requête invalide');

    if (typeof body.name === 'string') {
      await query('update admin_users set name = $1 where id = $2', [body.name.trim().slice(0, 120), admin.id]);
    }

    if (typeof body.newPassword === 'string') {
      if (!(await allow(`password-change:${admin.id}`, 5, 900))) return tooMany();
      const [row] = await query<{password_hash: string;}>('select password_hash from admin_users where id = $1', [admin.id]);
      const current = typeof body.currentPassword === 'string' ? body.currentPassword : '';
      if (!row || !(await verifyPassword(current, row.password_hash))) return error(400, 'Mot de passe actuel incorrect.');
      const problem = passwordProblem(body.newPassword);
      if (problem) return error(400, problem);
      const [updated] = await query<{session_version: number;}>(
        'update admin_users set password_hash = $1, session_version = session_version + 1 where id = $2 returning session_version',
        [await hashPassword(body.newPassword), admin.id]
      );
      // Nouvelle session pour l'appareil courant
      return json({ ok: true }, 200, { 'set-cookie': sessionCookie(admin.id, updated.session_version) });
    }
    return json({ ok: true });
  });
}
