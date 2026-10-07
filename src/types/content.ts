export type EventCategory = 'Concert' | 'Festival' | 'Formation' | 'Concours' | 'Conférence';

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  endDate?: string;
  time: string;
  venue: string;
  city: string;
  price: string;
  image: string;
  summary: string;
  description: string;
}

export interface RadioShow {
  id: string;
  days: number[];
  start: string;
  end: string;
  title: string;
  host: string;
  description: string;
}

export interface Artist {
  id: string;
  name: string;
  kind: 'Artiste' | 'Groupe';
  genre: string;
  city: string;
  image?: string;
  bio: string;
  // Mis en avant dans « Artistes à la une » sur l'accueil
  featured?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  audience: string;
  features: string[];
}

export interface NavItem {
  to: string;
  label: string;
}
export interface Release {
  id: string;
  title: string;
  artist: string;
  cover: string;
  releaseDate: string;
  youtubeUrl?: string | null;
  spotifyUrl?: string | null;
}

export type SiteSettings = Record<'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'spotify' | 'whatsapp', string>;
