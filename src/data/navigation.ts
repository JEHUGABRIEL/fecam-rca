import { NavItem } from '../types/content';

export const navItems: NavItem[] = [
{ to: '/evenements', label: 'Événements' },
{ to: '/actualites', label: 'Actualités' },
{ to: '/a-propos', label: 'La fédération' }];

// Pages secondaires : accessibles depuis le pied de page (la radio a aussi son bouton « Direct »)
export const secondaryNavItems: NavItem[] = [
{ to: '/radio', label: 'Radio FECAM' },
{ to: '/adhesion', label: 'Adhésion' },
{ to: '/contact', label: 'Contact' }];