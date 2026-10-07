import { query } from './db.js';
import { error } from './http.js';

// Adresse IP du client (Vercel renseigne x-forwarded-for / x-real-ip)
export function clientIp(request: Request) {
  return (request.headers.get('x-forwarded-for')?.split(',')[0] ?? request.headers.get('x-real-ip') ?? 'inconnue').trim();
}

// Protection CSRF : une requête qui modifie des données doit venir du site lui-même.
// Les navigateurs envoient toujours l'en-tête Origin sur POST/PATCH/PUT/DELETE.
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export const forbiddenOrigin = () => error(403, 'Requête refusée.');

// Compte une tentative pour « key » ; renvoie false si la limite est dépassée sur la fenêtre.
export async function allow(key: string, limit: number, windowSeconds: number) {
  const [row] = await query<{ count: number }>(
    `insert into rate_limits (key, count, reset_at) values ($1, 1, now() + make_interval(secs => $2))
     on conflict (key) do update set
       count = case when rate_limits.reset_at < now() then 1 else rate_limits.count + 1 end,
       reset_at = case when rate_limits.reset_at < now() then excluded.reset_at else rate_limits.reset_at end
     returning count`,
    [key, windowSeconds]
  );
  // Ménage occasionnel des compteurs expirés
  if (Math.random() < 0.02) await query(`delete from rate_limits where reset_at < now() - interval '1 day'`);
  return row.count <= limit;
}

export const resetLimit = (key: string) => query('delete from rate_limits where key = $1', [key]);

export const tooMany = () => error(429, 'Trop de tentatives. Réessayez dans quelques minutes.');
