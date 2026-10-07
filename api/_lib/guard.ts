import { error, serverError } from './http.js';
import { forbiddenOrigin, sameOrigin } from './security.js';
import { AdminUser, currentAdmin } from './session.js';
import { ValidationError } from './tables.js';

// Enveloppe des routes admin : session valide obligatoire, origine vérifiée pour les écritures,
// erreurs de validation et de contraintes Postgres traduites en 400.
export async function asAdmin(request: Request, run: (admin: AdminUser) => Promise<Response>) {
  if (request.method !== 'GET' && !sameOrigin(request)) return forbiddenOrigin();
  try {
    const admin = await currentAdmin(request);
    if (!admin) return error(401, 'Session expirée, reconnectez-vous.');
    return await run(admin);
  } catch (err) {
    if (err instanceof ValidationError) return error(400, err.message);
    const code = (err as {code?: string;}).code;
    if (code === '23514') return error(400, 'Valeur refusée : vérifiez les champs.');
    if (code === '23502') return error(400, 'Un champ obligatoire est vide.');
    if (code === '23505') return error(409, 'Cet élément existe déjà.');
    return serverError(err);
  }
}
