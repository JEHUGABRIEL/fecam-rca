import { artists as staticArtists } from '../data/artists';
import { events as staticEvents } from '../data/events';
import { news as staticNews } from '../data/news';
import { radioShows as staticRadioShows } from '../data/radioSchedule';
import { releases as staticReleases } from '../data/releases';
import { Artist, EventItem, NewsItem, RadioShow, Release } from '../types/content';
import { useCollection } from './useCollection';

export const useEvents = () => useCollection<EventItem>('events', staticEvents);
export const useNews = () => useCollection<NewsItem>('news', staticNews);
export const useArtists = () => useCollection<Artist>('artists', staticArtists);
export const useRadioShows = () => useCollection<RadioShow>('radio_shows', staticRadioShows);
export const useReleases = () => useCollection<Release>('releases', staticReleases);
