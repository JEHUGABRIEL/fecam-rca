import React, { useEffect, useState } from 'react';
import { CheckIcon, Loader2Icon } from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { api, ApiError, sendJson } from '../lib/api';
import { SiteSettings } from '../types/content';
import { inputClass } from './AdminCrudPage';

const networks: {key: keyof SiteSettings;label: string;placeholder: string;}[] = [
{ key: 'facebook', label: 'Facebook', placeholder: 'https://www.facebook.com/…' },
{ key: 'instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/…' },
{ key: 'youtube', label: 'YouTube', placeholder: 'https://www.youtube.com/@…' },
{ key: 'tiktok', label: 'TikTok', placeholder: 'https://www.tiktok.com/@…' },
{ key: 'spotify', label: 'Spotify', placeholder: 'https://open.spotify.com/…' },
{ key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/236…' }];


// Réglages du site : liens des réseaux sociaux affichés dans le pied de page
export function SettingsAdmin() {
  const { expire } = useAdminAuth();
  const [values, setValues] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<SiteSettings>('/api/settings').
    then(setValues).
    catch((err) => setError(err instanceof ApiError ? err.message : 'Chargement impossible.')).
    finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('saving');
    setError(null);
    try {
      setValues((await sendJson('/api/settings', 'PUT', values)) as Partial<SiteSettings>);
      setState('saved');
      window.setTimeout(() => setState('idle'), 2500);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) expire();
      setError(err instanceof ApiError ? err.message : 'Enregistrement impossible.');
      setState('idle');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-poster text-4xl uppercase">Réseaux sociaux</h1>
      <p className="mt-1 text-sm text-fecam-black/60">Réseaux sociaux affichés dans le pied de page. Laissez vide pour masquer un réseau.</p>

      <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-fecam-black/10 bg-white p-6">
        {loading ?
        <p className="text-sm text-fecam-black/50">Chargement…</p> :

        <div className="grid gap-5">
            {networks.map((n) =>
          <div key={n.key}>
                <label htmlFor={`s-${n.key}`} className="text-sm font-medium text-fecam-black/80">{n.label}</label>
                <input
              id={`s-${n.key}`}
              type="url"
              value={values[n.key] ?? ''}
              placeholder={n.placeholder}
              onChange={(e) => setValues((v) => ({ ...v, [n.key]: e.target.value }))}
              className={inputClass} />
            
              </div>
          )}
          </div>
        }
        <div className="mt-6 flex items-center gap-4">
          <button type="submit" disabled={state === 'saving' || loading} className="btn-dark !py-2.5 disabled:opacity-70">
            {state === 'saving' && <Loader2Icon className="h-4 w-4 animate-spin" />}
            {state === 'saved' ? <><CheckIcon className="h-4 w-4" /> Enregistré</> : 'Enregistrer'}
          </button>
          {error && <p className="text-sm font-medium text-red-700">{error}</p>}
        </div>
      </form>
    </div>);

}
