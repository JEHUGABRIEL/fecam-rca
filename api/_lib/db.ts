import { neon } from '@neondatabase/serverless';

let client: ReturnType<typeof neon> | null = null;

// Client HTTP Neon, créé à la première requête (DATABASE_URL est fournie par l'intégration Vercel)
export function db() {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL manquante');
    client = neon(url);
  }
  return client;
}

// Requête paramétrée : les valeurs passent toujours en $1, $2… ; seuls les identifiants
// issus de la liste blanche de tables.ts sont interpolés dans le texte SQL.
export async function query<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[]> {
  return (await db().query(text, params)) as T[];
}
