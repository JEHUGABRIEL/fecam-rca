import { createHmac, timingSafeEqual } from 'node:crypto';

// Session admin sans état : cookie « <expiration>.<hmac> » signé avec ADMIN_SESSION_SECRET.
export const SESSION_COOKIE = 'fecam_admin';
const TTL_SECONDS = 60 * 60 * 24 * 7;

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) throw new Error('ADMIN_SESSION_SECRET doit faire au moins 32 caractères');
  return s;
}

const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url');

export function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPassword(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error('ADMIN_PASSWORD manquant');
  // Compare des empreintes de même longueur pour ne rien révéler de la longueur du mot de passe
  const h = (v: string) => createHmac('sha256', secret()).update(v).digest('hex');
  return safeEqual(h(candidate), h(expected));
}

function readCookie(request: Request, name: string) {
  const header = request.headers.get('cookie') ?? '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return undefined;
}

export function isAuthenticated(request: Request) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) return false;
  const [expires, signature] = token.split('.');
  if (!expires || !signature) return false;
  try {
    if (!safeEqual(signature, sign(expires))) return false;
  } catch {
    return false;
  }
  return Number(expires) > Date.now() / 1000;
}

export function sessionCookie() {
  const expires = String(Math.floor(Date.now() / 1000) + TTL_SECONDS);
  return `${SESSION_COOKIE}=${expires}.${sign(expires)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${TTL_SECONDS}`;
}

export const clearedCookie = () => `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
