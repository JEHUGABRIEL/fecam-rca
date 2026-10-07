import React, { useState } from 'react';
import { CheckIcon, Loader2Icon } from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { ApiError, sendJson } from '../lib/api';
import { inputClass } from './AdminCrudPage';
import { PasswordInput } from './ui/PasswordInput';

type State = 'idle' | 'saving' | 'saved';

function useAction() {
  const { expire } = useAdminAuth();
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState<string | null>(null);
  const run = async (fn: () => Promise<unknown>) => {
    setState('saving');
    setError(null);
    try {
      await fn();
      setState('saved');
      window.setTimeout(() => setState('idle'), 2500);
      return true;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) expire();
      setError(err instanceof ApiError ? err.message : 'Une erreur est survenue.');
      setState('idle');
      return false;
    }
  };
  return { state, error, run, setError };
}

function SaveButton({ state, label }: {state: State;label: string;}) {
  return (
    <button type="submit" disabled={state === 'saving'} className="btn-dark !py-2.5 disabled:opacity-70">
      {state === 'saving' && <Loader2Icon className="h-4 w-4 animate-spin" />}
      {state === 'saved' ? <><CheckIcon className="h-4 w-4" /> Enregistré</> : label}
    </button>);

}

export function AccountPage() {
  const { user, setUser } = useAdminAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const profile = useAction();
  const password = useAction();

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    profile.run(async () => {
      await sendJson('/api/admin/account', 'PATCH', { name });
      if (user) setUser({ ...user, name: name.trim() });
    });
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) return password.setError('Les deux nouveaux mots de passe ne correspondent pas.');
    const ok = await password.run(() => sendJson('/api/admin/account', 'PATCH', { currentPassword: pw.current, newPassword: pw.next }));
    if (ok) setPw({ current: '', next: '', confirm: '' });
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-poster text-4xl uppercase">Mon compte</h1>
      <p className="mt-1 text-sm text-fecam-black/60">Connecté en tant que {user?.email}.</p>

      <form onSubmit={saveProfile} className="mt-8 rounded-2xl border border-fecam-black/10 bg-white p-6">
        <h2 className="font-display text-lg font-bold">Profil</h2>
        <label htmlFor="account-name" className="mt-4 block text-sm font-medium text-fecam-black/80">Nom affiché</label>
        <input id="account-name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        <div className="mt-5 flex items-center gap-4">
          <SaveButton state={profile.state} label="Enregistrer" />
          {profile.error && <p className="text-sm font-medium text-red-700">{profile.error}</p>}
        </div>
      </form>

      <form onSubmit={savePassword} className="mt-6 rounded-2xl border border-fecam-black/10 bg-white p-6">
        <h2 className="font-display text-lg font-bold">Mot de passe</h2>
        <p className="mt-1 text-sm text-fecam-black/60">Changer le mot de passe déconnecte vos autres appareils.</p>
        <div className="mt-4 grid gap-4">
          {([
          ['current', 'Mot de passe actuel', 'current-password'],
          ['next', 'Nouveau mot de passe (12 caractères minimum)', 'new-password'],
          ['confirm', 'Confirmer le nouveau mot de passe', 'new-password']] as const).
          map(([key, label, autoComplete]) =>
          <div key={key}>
              <label htmlFor={`pw-${key}`} className="text-sm font-medium text-fecam-black/80">{label}</label>
              <PasswordInput
              id={`pw-${key}`}
              required
              minLength={key === 'current' ? undefined : 12}
              autoComplete={autoComplete}
              value={pw[key]}
              onChange={(e) => setPw({ ...pw, [key]: e.target.value })}
              inputClassName={inputClass} />
            
            </div>
          )}
        </div>
        <div className="mt-5 flex items-center gap-4">
          <SaveButton state={password.state} label="Changer le mot de passe" />
          {password.error && <p className="text-sm font-medium text-red-700" role="alert">{password.error}</p>}
        </div>
      </form>
    </div>);

}
