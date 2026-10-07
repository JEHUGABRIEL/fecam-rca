export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

// Appel JSON vers les fonctions /api (Vercel). Une réponse non JSON (ex. serveur Vite seul,
// sans les fonctions) est traitée comme une API indisponible.
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      credentials: 'same-origin',
      ...init,
      headers: init.body && typeof init.body === 'string' ? { 'content-type': 'application/json', ...init.headers } : init.headers
    });
  } catch {
    throw new ApiError('Connexion impossible. Vérifiez votre réseau.', 0);
  }
  const isJson = res.headers.get('content-type')?.includes('application/json');
  if (!isJson) throw new ApiError('Service momentanément indisponible.', res.status);
  const body = await res.json();
  if (!res.ok) throw new ApiError(body?.error ?? 'Une erreur est survenue.', res.status);
  return body as T;
}

export const sendJson = (path: string, method: string, data?: unknown) =>
api<Record<string, unknown>>(path, { method, body: data === undefined ? undefined : JSON.stringify(data) });
