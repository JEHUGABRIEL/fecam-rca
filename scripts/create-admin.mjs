// Crée (ou réinitialise) un compte administrateur.
// Usage : ADMIN_EMAIL=… ADMIN_NAME=… ADMIN_NEW_PASSWORD=… node scripts/create-admin.mjs --sql | psql "$DATABASE_URL"
// Le mot de passe passe par une variable d'environnement pour ne pas apparaître dans l'historique du shell.
import { randomBytes, scryptSync } from 'node:crypto';

const email = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
const name = (process.env.ADMIN_NAME ?? '').trim();
const password = process.env.ADMIN_NEW_PASSWORD ?? '';
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('ADMIN_EMAIL invalide');
if (password.length < 12) throw new Error('ADMIN_NEW_PASSWORD : 12 caractères minimum');

// Même format que api/_lib/password.ts
const [N, r, p] = [16384, 8, 1];
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64, { N, r, p, maxmem: 128 * N * r * 2 });
const stored = ['scrypt', N, r, p, salt.toString('base64url'), hash.toString('base64url')].join('$');

const lit = (v) => `'${v.replace(/'/g, "''")}'`;
// Réinitialiser le mot de passe incrémente session_version : les anciennes sessions sont révoquées
console.log(
  `insert into admin_users (email, name, password_hash) values (${lit(email)}, ${lit(name)}, ${lit(stored)}) ` +
  `on conflict (email) do update set password_hash = excluded.password_hash, name = excluded.name, ` +
  `session_version = admin_users.session_version + 1;`
);
