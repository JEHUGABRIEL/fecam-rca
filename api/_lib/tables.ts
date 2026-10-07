// Liste blanche des tables exposées par l'API. Aucun nom de table ou de colonne ne vient
// de la requête : tout identifiant interpolé dans le SQL provient d'ici.

type ColType = 'text' | 'date' | 'int' | 'days' | 'bool' | 'url';

interface Column {
  name: string;
  type: ColType;
  required?: boolean;
  // Longueur maximale pour les champs texte (défaut : 5000)
  max?: number;
}

export interface TableDef {
  // Colonnes modifiables depuis le back-office
  columns: Column[];
  // SELECT utilisé par le back-office (noms de colonnes bruts)
  adminSelect: string;
  // SELECT public (clés au format attendu par le site) ; absent = table non lisible publiquement
  publicSelect?: string;
  order: string;
  // Colonnes que le public peut envoyer via /api/submit ; absent = envoi public interdit
  publicInsert?: string[];
}

const t = (name: string, required = false, max?: number): Column => ({ name, type: 'text', required, max });

export const tables: Record<string, TableDef> = {
  events: {
    columns: [
    t('title', true, 200),
    t('category', true),
    { name: 'date', type: 'date', required: true },
    { name: 'end_date', type: 'date' },
    t('time', true, 40),
    t('venue', true, 200),
    t('city', true, 100),
    t('price', true, 100),
    { name: 'image', type: 'url' },
    t('summary', false, 400),
    t('description', true)],

    adminSelect:
    'id, title, category, date::text as date, end_date::text as end_date, time, venue, city, price, image, summary, description',
    publicSelect:
    'id, title, category, date::text as date, end_date::text as "endDate", time, venue, city, price, image, summary, description',
    order: 'date asc'
  },
  news: {
    columns: [t('title', true, 200), { name: 'date', type: 'date', required: true }, t('category', true, 60), t('excerpt', true, 600), { name: 'image', type: 'url' }],
    adminSelect: 'id, title, date::text as date, category, excerpt, image',
    publicSelect: 'id, title, date::text as date, category, excerpt, image',
    order: 'date desc'
  },
  artists: {
    columns: [
    t('name', true, 120),
    t('kind', true),
    t('genre', true, 60),
    t('city', true, 100),
    { name: 'image', type: 'url' },
    t('bio', true, 1000),
    { name: 'featured', type: 'bool' }],

    adminSelect: 'id, name, kind, genre, city, image, bio, featured',
    publicSelect: 'id, name, kind, genre, city, image, bio, featured',
    order: 'name asc'
  },
  releases: {
    columns: [
    t('title', true, 200),
    t('artist', true, 120),
    { name: 'cover', type: 'url' },
    { name: 'release_date', type: 'date', required: true },
    { name: 'youtube_url', type: 'url' },
    { name: 'spotify_url', type: 'url' }],

    adminSelect: 'id, title, artist, cover, release_date::text as release_date, youtube_url, spotify_url',
    publicSelect:
    'id, title, artist, cover, release_date::text as "releaseDate", youtube_url as "youtubeUrl", spotify_url as "spotifyUrl"',
    order: 'release_date desc'
  },
  radio_shows: {
    columns: [
    t('title', true, 120),
    t('host', true, 120),
    t('start', true, 5),
    t('end', true, 5),
    { name: 'days', type: 'days', required: true },
    t('description', false, 400)],

    adminSelect: 'id, title, host, start, "end", days, description',
    publicSelect: 'id, title, host, start, "end", days, description',
    order: 'start asc'
  },
  membership_requests: {
    columns: [t('status', true)],
    adminSelect: 'id, plan, name, genre, phone, email, city, presentation, status, created_at::text as created_at',
    order: 'created_at desc',
    publicInsert: ['plan', 'name', 'genre', 'phone', 'email', 'city', 'presentation']
  },
  contact_messages: {
    columns: [t('status', true)],
    adminSelect: 'id, name, email, subject, message, status, created_at::text as created_at',
    order: 'created_at desc',
    publicInsert: ['name', 'email', 'subject', 'message']
  },
  reservations: {
    columns: [t('status', true)],
    adminSelect: 'id, event_id, event_title, name, phone, seats, status, created_at::text as created_at',
    order: 'created_at desc',
    publicInsert: ['event_id', 'event_title', 'name', 'phone', 'seats']
  },
  dedications: {
    columns: [t('status', true)],
    adminSelect: 'id, name, city, song, message, status, created_at::text as created_at',
    order: 'created_at desc',
    publicInsert: ['name', 'city', 'song', 'message']
  },
  newsletter_subscribers: {
    columns: [],
    adminSelect: 'id, email, created_at::text as created_at',
    order: 'created_at desc',
    publicInsert: ['email']
  }
};

// Champs requis à l'envoi public (les autres sont facultatifs)
export const publicRequired: Record<string, string[]> = {
  membership_requests: ['plan', 'name', 'phone', 'city'],
  contact_messages: ['name', 'email', 'message'],
  reservations: ['event_title', 'name', 'phone'],
  dedications: ['name', 'message'],
  newsletter_subscribers: ['email']
};

const columnTypes: Record<string, ColType> = { seats: 'int', email: 'text' };

export class ValidationError extends Error {}

// Convertit et vérifie une valeur reçue en JSON selon le type de colonne
export function coerce(col: Column | { name: string; type?: ColType; max?: number }, raw: unknown): unknown {
  const type = col.type ?? columnTypes[col.name] ?? 'text';
  if (raw === undefined || raw === null || raw === '') return type === 'bool' ? false : null;
  switch (type) {
    case 'bool':
      return raw === true || raw === 'true';
    case 'int':{
        const n = Number(raw);
        if (!Number.isInteger(n)) throw new ValidationError(`${col.name} : nombre entier attendu`);
        return n;
      }
    case 'days':{
        const list = Array.isArray(raw) ? raw : String(raw).split(',');
        const days = list.map((d) => Number(String(d).trim()));
        if (days.length === 0 || days.some((d) => !Number.isInteger(d) || d < 0 || d > 6)) {
          throw new ValidationError('Jours : valeurs de 0 (dimanche) à 6 (samedi)');
        }
        return [...new Set(days)];
      }
    case 'date':{
        const s = String(raw);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new ValidationError(`${col.name} : date AAAA-MM-JJ attendue`);
        return s;
      }
    case 'url':{
        const s = String(raw).trim();
        // URL absolue http(s) ou chemin local du site (/image.jpg)
        if (!/^(https?:\/\/|\/)/.test(s) || s.length > 1000) throw new ValidationError(`${col.name} : lien invalide`);
        return s;
      }
    default:{
        const s = String(raw).trim();
        if (s.length > (col.max ?? 5000)) throw new ValidationError(`${col.name} : texte trop long`);
        return s;
      }
  }
}

// Identifiant SQL (les colonnes « end » et autres mots réservés sont protégées par des guillemets)
export const ident = (name: string) => `"${name}"`;
