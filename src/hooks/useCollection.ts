import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';

// Sert les données du site depuis l'API (/api/content/:table). Si l'API ne répond pas
// (développement avec Vite seul, panne), le site retombe sur les données statiques de /src/data.
export function useCollection<T>(table: string, fallback: T[]) {
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setData(await api<T[]>(`/api/content/${table}`));
      setUsingFallback(false);
    } catch {
      setData(fallback);
      setUsingFallback(true);
    }
    setLoading(false);
    // fallback ne doit pas redéclencher le chargement à chaque rendu
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, usingFallback, refresh };
}
