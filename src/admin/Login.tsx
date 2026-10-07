import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, Loader2Icon, LockIcon } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { inputClass } from './AdminCrudPage';
import { PasswordInput } from './ui/PasswordInput';

export function Login() {
  const { authenticated, loading, signIn } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && authenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(await signIn(email, password));
    setSubmitting(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-fecam-sand px-5 py-16">
      <Link to="/" className="link-draw absolute left-5 top-5 text-fecam-black/70 hover:text-fecam-black lg:left-8 lg:top-8">
        <ArrowLeftIcon className="h-4 w-4" /> Retour au site
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm rounded-3xl bg-fecam-paper p-8 shadow-[0_30px_60px_-30px_rgba(26,22,18,0.35)]">

        <Logo className="text-base" />
        <h1 className="mt-8 font-poster text-3xl uppercase">Back-office</h1>
        <p className="mt-1 text-sm text-fecam-black/60">Connectez-vous pour gérer le contenu du site.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-email" className="text-sm font-medium text-fecam-black/80">Email</label>
            <input
              id="admin-email"
              type="email"
              required
              autoFocus
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass} />

          </div>
          <div>
            <label htmlFor="admin-password" className="text-sm font-medium text-fecam-black/80">Mot de passe</label>
            <PasswordInput
              id="admin-password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              inputClassName={inputClass} />

          </div>
          {error && <p className="text-sm font-medium text-red-700" role="alert">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-dark w-full disabled:opacity-70">
            {submitting && <Loader2Icon className="h-4 w-4 animate-spin" />}
            Se connecter
          </button>
        </form>
        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-fecam-black/45">
          <LockIcon className="h-3 w-3" /> Connexion chiffrée · tentatives limitées
        </p>
      </motion.div>
    </div>);

}
