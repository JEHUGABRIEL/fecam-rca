import { put } from '@vercel/blob';
import { error, json, serverError } from '../_lib/http';
import { isAuthenticated } from '../_lib/session';

const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_BYTES = 4 * 1024 * 1024;

// POST /api/admin/upload?name=photo.jpg — corps brut = l'image ; renvoie son URL publique (Vercel Blob)
export async function POST(request: Request) {
  if (!isAuthenticated(request)) return error(401, 'Session expirée, reconnectez-vous.');
  const type = request.headers.get('content-type') ?? '';
  if (!allowed.includes(type)) return error(400, 'Format accepté : JPG, PNG, WebP ou AVIF.');
  const data = await request.arrayBuffer();
  if (data.byteLength === 0) return error(400, 'Fichier vide');
  if (data.byteLength > MAX_BYTES) return error(413, 'Image trop lourde (4 Mo maximum).');

  const raw = new URL(request.url).searchParams.get('name') ?? 'image';
  const safeName = raw.toLowerCase().replace(/[^a-z0-9.]+/g, '-').slice(-60);
  try {
    const blob = await put(`uploads/${safeName}`, data, { access: 'public', contentType: type, addRandomSuffix: true });
    return json({ url: blob.url }, 201);
  } catch (err) {
    return serverError(err);
  }
}
