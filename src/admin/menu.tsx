import { ComponentType, lazy } from 'react';
import { CalendarDaysIcon, LayoutDashboardIcon, NewspaperIcon, RadioIcon, SettingsIcon, UsersIcon } from 'lucide-react';

// Charge une page du back-office à la demande (exports nommés → React.lazy)
const page = <K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) =>
lazy(() => load().then((m) => ({ default: m[name] })));

const events = () => import('./EventsAdmin');
const inbox = () => import('./InboxPage');

export interface MenuItem {
  path: string;
  label: string;
  element: ComponentType;
}

export interface MenuGroup {
  label: string;
  icon: typeof LayoutDashboardIcon;
  base: string;
  items: MenuItem[];
}

export const Dashboard = page(() => import('./Dashboard'), 'Dashboard');

// Une rubrique par entrée de la barre latérale ; chaque sous-menu a sa propre page.
export const menu: MenuGroup[] = [
{
  label: 'Événements',
  icon: CalendarDaysIcon,
  base: 'evenements',
  items: [
  { path: 'a-venir', label: 'À venir', element: page(events, 'UpcomingEventsAdmin') },
  { path: 'passes', label: 'Passés', element: page(events, 'PastEventsAdmin') },
  { path: 'reservations', label: 'Réservations', element: page(inbox, 'ReservationsInbox') }]

},
{
  label: 'Éditorial',
  icon: NewspaperIcon,
  base: 'editorial',
  items: [
  { path: 'actualites', label: 'Actualités', element: page(() => import('./NewsAdmin'), 'NewsAdmin') },
  { path: 'sorties', label: 'Dernières sorties', element: page(() => import('./ReleasesAdmin'), 'ReleasesAdmin') },
  { path: 'artistes', label: 'Artistes', element: page(() => import('./ArtistsAdmin'), 'ArtistsAdmin') }]

},
{
  label: 'Radio',
  icon: RadioIcon,
  base: 'radio',
  items: [
  { path: 'grille', label: 'Grille des programmes', element: page(() => import('./RadioAdmin'), 'RadioAdmin') },
  { path: 'dedicaces', label: 'Dédicaces', element: page(inbox, 'DedicationsInbox') }]

},
{
  label: 'Membres & contacts',
  icon: UsersIcon,
  base: 'membres',
  items: [
  { path: 'adhesions', label: 'Adhésions', element: page(inbox, 'MembershipInbox') },
  { path: 'messages', label: 'Messages', element: page(inbox, 'MessagesInbox') },
  { path: 'newsletter', label: 'Newsletter', element: page(inbox, 'NewsletterInbox') }]

},
{
  label: 'Paramètres',
  icon: SettingsIcon,
  base: 'parametres',
  items: [
  { path: 'reseaux-sociaux', label: 'Réseaux sociaux', element: page(() => import('./SettingsAdmin'), 'SettingsAdmin') },
  { path: 'administrateurs', label: 'Administrateurs', element: page(() => import('./AdminUsersPage'), 'AdminUsersPage') },
  { path: 'mon-compte', label: 'Mon compte', element: page(() => import('./AccountPage'), 'AccountPage') }]

}];


export const dashboardIcon = LayoutDashboardIcon;
export const adminPath = (group: MenuGroup, item: MenuItem) => `/admin/${group.base}/${item.path}`;
