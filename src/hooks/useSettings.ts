import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { SiteSettings } from '../types/content';

const empty: SiteSettings = { facebook: '', instagram: '', youtube: '', tiktok: '', spotify: '', whatsapp: '' };

// Réglages du site (réseaux sociaux) saisis dans le back-office ; vides si l'API ne répond pas.
export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(empty);
  useEffect(() => {
    api<SiteSettings>('/api/settings').then(setSettings).catch(() => setSettings(empty));
  }, []);
  return settings;
}
