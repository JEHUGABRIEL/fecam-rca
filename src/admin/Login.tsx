import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { inputClass } from './AdminCrudPage';

export function Login() {
  const { authenticated, loading, signIn } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && authenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(await signIn(password));
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-fecam-sand px-5">
      <div className="w-full max-w-sm rounded-3xl bg-fecam-paper p-8 shadow-[0_30px_60px_-30px_rgba(26,22,18,0.35)]">
        <Logo className="text-base" />
        <h1 className="mt-8 font-poster text-3xl uppercase">Back-office</h1>
        <p className="mt-1 text-sm text-fecam-black/60">Connectez-vous pour gérer le contenu du site.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-password" className="text-sm font-medium text-fecam-black/80">Mot de passe</label>
            <input
              id="admin-password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass} />
            
          </div>
          {error && <p className="text-sm font-medium text-red-700" role="alert">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-dark w-full disabled:opacity-70">
            {submitting && <Loader2Icon className="h-4 w-4 animate-spin" />}
            Se connecter
          </button>
        </form>
      </div>
    </div>);

}
