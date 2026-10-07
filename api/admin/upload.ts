import { put } from '@vercel/blob';
import { asAdmin } from '../_lib/guard.js';
import { error, json } from '../_lib/http.js';

const MAX_BYTES = 4 * 1024 * 1024;

// Type réel du fichier d'après sa signature binaire (l'en-tête Content-Type ne suffit pas)
function sniff(bytes: Uint8Array): string | null {
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes[0] === 0x89 && ascii(1, 4) === 'PNG') return 'image/png';
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';
  if (ascii(4, 8) === 'ftyp' && ['avif', 'avis'].includes(ascii(8, 12))) return 'image/avif';
  return null;
}

const extensions: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };

// POST /api/admin/upload?name=photo.jpg — corps brut = l'image ; renvoie son URL publique (Vercel Blob)
export function POST(request: Request) {
  return asAdmin(request, async () => {
    const declared = Number(request.headers.get('content-length') ?? 0);
    if (declared > MAX_BYTES) return error(413, 'Image trop lourde (4 Mo maximum).');
    const data = new Uint8Array(await request.arrayBuffer());
    if (data.byteLength === 0) return error(400, 'Fichier vide');
    if (data.byteLength > MAX_BYTES) return error(413, 'Image trop lourde (4 Mo maximum).');

    const type = sniff(data);
    if (!type) return error(400, 'Format accepté : JPG, PNG, WebP ou AVIF.');

    // Nom nettoyé, extension imposée par le type réel
    const raw = new URL(request.url).searchParams.get('name') ?? 'image';
    const base = raw.toLowerCase().replace(/\.[a-z0-9]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'image';
    const blob = await put(`uploads/${base}.${extensions[type]}`, Buffer.from(data), { access: 'public', contentType: type, addRandomSuffix: true });
    return json({ url: blob.url }, 201);
  });
}
