import { AudioLinesIcon, FacebookIcon, InstagramIcon, MessageCircleIcon, Music2Icon, YoutubeIcon } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { SiteSettings } from '../types/content';

const networks: {key: keyof SiteSettings;label: string;icon: typeof FacebookIcon;}[] = [
{ key: 'facebook', label: 'Facebook', icon: FacebookIcon },
{ key: 'instagram', label: 'Instagram', icon: InstagramIcon },
{ key: 'youtube', label: 'YouTube', icon: YoutubeIcon },
{ key: 'tiktok', label: 'TikTok', icon: Music2Icon },
{ key: 'spotify', label: 'Spotify', icon: AudioLinesIcon },
{ key: 'whatsapp', label: 'WhatsApp', icon: MessageCircleIcon }];


// Liens des réseaux renseignés dans le back-office (Réglages) ; rien ne s'affiche s'ils sont vides.
export function SocialLinks({ className = '' }: {className?: string;}) {
  const settings = useSettings();
  const active = networks.filter((n) => settings[n.key]);
  if (active.length === 0) return null;

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {active.map(({ key, label, icon: Icon }) =>
      <li key={key}>
          <a
          href={settings[key]}
          target="_blank"
          rel="noreferrer"
          aria-label={`${label} (nouvel onglet)`}
          title={label}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-fecam-paper/20 text-fecam-paper/75 transition-colors duration-300 hover:border-fecam-paper hover:bg-fecam-paper hover:text-fecam-black">
          
            <Icon className="h-4 w-4" />
          </a>
        </li>
      )}
    </ul>);

}
