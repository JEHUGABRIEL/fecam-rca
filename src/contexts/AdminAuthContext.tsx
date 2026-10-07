import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, ApiError, sendJson } from '../lib/api';

interface AdminAuthValue {
  authenticated: boolean;
  loading: boolean;
  signIn: (password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  // Appelé quand l'API répond 401 : renvoie vers la page de connexion
  expire: () => void;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: {children: React.ReactNode;}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{authenticated: boolean;}>('/api/admin/auth').
    then((r) => setAuthenticated(r.authenticated)).
    catch(() => setAuthenticated(false)).
    finally(() => setLoading(false));
  }, []);

  const signIn = async (password: string) => {
    try {
      await sendJson('/api/admin/auth', 'POST', { password });
      setAuthenticated(true);
      return null;
    } catch (err) {
      return err instanceof ApiError ? err.message : 'Connexion impossible.';
    }
  };

  const signOut = async () => {
    await sendJson('/api/admin/auth', 'DELETE').catch(() => undefined);
    setAuthenticated(false);
  };

  const expire = useCallback(() => setAuthenticated(false), []);

  return (
    <AdminAuthContext.Provider value={{ authenticated, loading, signIn, signOut, expire }}>
      {children}
    </AdminAuthContext.Provider>);

}

export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth doit être utilisé dans AdminAuthProvider');
  return ctx;
}
