import { createHmac, timingSafeEqual } from 'node:crypto';
import { query } from './db.js';

// Session admin : cookie « <données>.<hmac> » signé avec ADMIN_SESSION_SECRET.
// Les données portent l'id du compte et sa version de session : changer le mot de passe
// (ou supprimer le compte) invalide immédiatement toutes ses sessions.
// Préfixe __Host- : cookie limité à ce domaine exact, en HTTPS, sur tout le site.
export const SESSION_COOKIE = '__Host-fecam_admin';
const TTL_SECONDS = 60 * 60 * 12;

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) throw new Error('ADMIN_SESSION_SECRET doit faire au moins 32 caractères');
  return s;
}

const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url');

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

function readCookie(request: Request, name: string) {
  const header = request.headers.get('cookie') ?? '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return undefined;
}

// Compte admin de la requête, ou null si la session est absente, falsifiée, expirée ou révoquée
export async function currentAdmin(request: Request): Promise<AdminUser | null> {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  try {
    if (!safeEqual(signature, sign(payload))) return null;
    const { u, v, e } = JSON.parse(Buffer.from(payload, 'base64url').toString()) as {u: string;v: number;e: number;};
    if (!u || e < Date.now() / 1000) return null;
    const [user] = await query<AdminUser>('select id, email, name from admin_users where id = $1 and session_version = $2', [u, v]);
    return user ?? null;
  } catch {
    return null;
  }
}

export function sessionCookie(userId: string, version: number) {
  const payload = Buffer.from(JSON.stringify({ u: userId, v: version, e: Math.floor(Date.now() / 1000) + TTL_SECONDS })).toString('base64url');
  return `${SESSION_COOKIE}=${payload}.${sign(payload)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${TTL_SECONDS}`;
}

export const clearedCookie = () => `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
