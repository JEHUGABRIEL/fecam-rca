import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number, opts: object) => Promise<Buffer>;

// Paramètres scrypt (≈ 64 Mo de mémoire) : coûteux pour une attaque par force brute
const N = 16384;
const r = 8;
const p = 1;
const KEYLEN = 64;

export const MIN_PASSWORD_LENGTH = 12;

// Format stocké : scrypt$N$r$p$sel$empreinte (base64url)
export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEYLEN, { N, r, p, maxmem: 128 * N * r * 2 });
  return ['scrypt', N, r, p, salt.toString('base64url'), hash.toString('base64url')].join('$');
}

export async function verifyPassword(password: string, stored: string) {
  const [algo, n, rr, pp, salt, hash] = stored.split('$');
  if (algo !== 'scrypt' || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'base64url');
  const actual = await scrypt(password, Buffer.from(salt, 'base64url'), expected.length, {
    N: Number(n),
    r: Number(rr),
    p: Number(pp),
    maxmem: 128 * Number(n) * Number(rr) * 2
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Empreinte factice : vérifiée quand l'email est inconnu, pour que la durée de réponse
// ne révèle pas si un compte existe.
export const DUMMY_HASH =
'scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

export function passwordProblem(password: string) {
  if (password.length < MIN_PASSWORD_LENGTH) return `Le mot de passe doit faire au moins ${MIN_PASSWORD_LENGTH} caractères.`;
  if (password.length > 200) return 'Mot de passe trop long.';
  return null;
}
