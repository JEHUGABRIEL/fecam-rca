import { useCallback, useEffect, useState } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { api, ApiError, sendJson } from '../lib/api';

// Lecture et édition d'une table du back-office via /api/admin/:table.
export function useAdminTable<T extends {id: string;}>(table: string) {
  const { expire } = useAdminAuth();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fail = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && err.status === 401) expire();
      setError(err instanceof ApiError ? err.message : 'Une erreur est survenue.');
    },
    [expire]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setData(await api<T[]>(`/api/admin/${table}`));
      setError(null);
    } catch (err) {
      fail(err);
    }
    setLoading(false);
  }, [table, fail]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const run = useCallback(
    async (method: string, body?: unknown, id?: string) => {
      setSaving(true);
      setError(null);
      try {
        await sendJson(`/api/admin/${table}${id ? `?id=${encodeURIComponent(id)}` : ''}`, method, body);
        await refresh();
        return true;
      } catch (err) {
        fail(err);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [table, refresh, fail]
  );

  return {
    data,
    loading,
    saving,
    error,
    refresh,
    create: (values: Record<string, unknown>) => run('POST', values),
    update: (id: string, values: Record<string, unknown>) => run('PATCH', values, id),
    remove: (id: string) => run('DELETE', undefined, id),
    clearError: () => setError(null)
  };
}

// Envoie une image vers Vercel Blob et renvoie son URL publique
export async function uploadImage(file: File) {
  const res = await api<{url: string;}>(`/api/admin/upload?name=${encodeURIComponent(file.name)}`, {
    method: 'POST',
    headers: { 'content-type': file.type },
    body: file
  });
  return res.url;
}
