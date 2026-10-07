import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, ApiError, sendJson } from '../lib/api';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  authenticated: boolean;
  user: AdminUser | null;
}

interface AdminAuthValue {
  authenticated: boolean;
  user: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  setUser: (user: AdminUser) => void;
  signOut: () => Promise<void>;
  // Appelé quand l'API répond 401 : renvoie vers la page de connexion
  expire: () => void;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const authenticated = Boolean(user);

  useEffect(() => {
    api<AuthResponse>('/api/admin/auth').
    then((r) => setUser(r.user)).
    catch(() => setUser(null)).
    finally(() => setLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const r = (await sendJson('/api/admin/auth', 'POST', { email, password })) as unknown as AuthResponse;
      setUser(r.user);
      return null;
    } catch (err) {
      return err instanceof ApiError ? err.message : 'Connexion impossible.';
    }
  };

  const signOut = async () => {
    await sendJson('/api/admin/auth', 'DELETE').catch(() => undefined);
    setUser(null);
  };

  const expire = useCallback(() => setUser(null), []);

  return (
    <AdminAuthContext.Provider value={{ authenticated, user, loading, signIn, setUser, signOut, expire }}>
      {children}
    </AdminAuthContext.Provider>);

}

export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth doit être utilisé dans AdminAuthProvider');
  return ctx;
}
