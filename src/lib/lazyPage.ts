import { ComponentType, lazy } from 'react';

const RELOAD_KEY = 'fecam-chunk-reload';

// Charge une page à la demande (exports nommés → React.lazy).
// Après une mise en ligne, un onglet resté ouvert réclame d'anciens fichiers qui n'existent
// plus : on recharge alors la page une fois pour récupérer la nouvelle version du site.
export function lazyPage<K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) {
  return lazy(async () => {
    try {
      const module = await load();
      sessionStorage.removeItem(RELOAD_KEY);
      return { default: module[name] };
    } catch (err) {
      if (!sessionStorage.getItem(RELOAD_KEY)) {
        sessionStorage.setItem(RELOAD_KEY, '1');
        window.location.reload();
        // La page se recharge : on ne rend rien d'ici là
        return { default: (() => null) as ComponentType };
      }
      throw err;
    }
  });
}
