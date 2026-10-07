import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';

// En développement avec Vite seul (sans les fonctions /api), on affiche les données d'exemple
// de /src/data. En production, jamais : un contenu d'exemple pourrait faire réapparaître un
// élément supprimé dans le back-office. On montre plutôt le chargement, puis une erreur.
const useExamples = import.meta.env.DEV;

export function useCollection<T>(table: string, fallback: T[]) {
  const [data, setData] = useState<T[]>(useExamples ? fallback : []);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    // Un second essai après une courte pause absorbe les coupures réseau passagères
    for (const delay of [0, 1500]) {
      if (delay) await new Promise((r) => setTimeout(r, delay));
      try {
        setData(await api<T[]>(`/api/content/${table}`));
        setLoading(false);
        return;
      } catch {
        // essai suivant
      }
    }
    if (useExamples) setData(fallback);else
    setFailed(true);
    setLoading(false);
    // fallback ne doit pas redéclencher le chargement à chaque rendu
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, failed, refresh };
}
