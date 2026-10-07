export function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers }
  });
}

export const error = (status: number, message: string) => json({ error: message }, status);

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

// Dernier segment du chemin : /api/content/events → « events »
export function lastSegment(request: Request) {
  const parts = new URL(request.url).pathname.split('/').filter(Boolean);
  return decodeURIComponent(parts[parts.length - 1] ?? '');
}

// Journalise l'erreur côté serveur sans exposer le détail au navigateur
export function serverError(err: unknown) {
  console.error(err);
  return error(500, 'Erreur serveur, réessayez dans un instant.');
}
