import { RadioShow } from '../types/content';

// days : 0 = dimanche, 1 = lundi … 6 = samedi
export const radioShows: RadioShow[] = [
{ id: 'playlist-nuit', days: [0, 1, 2, 3, 4, 5, 6], start: '00:00', end: '06:00', title: 'Playlist FECAM', host: 'Programmation musicale', description: 'Le meilleur de la musique centrafricaine, sans interruption.' },
{ id: 'reveil-bangui', days: [1, 2, 3, 4, 5], start: '06:00', end: '09:00', title: 'Le Réveil de Bangui', host: 'Marcelle Kossi', description: 'La matinale : actualité culturelle, agenda du jour et nouveautés.' },
{ id: 'rumba-time', days: [1, 2, 3, 4, 5], start: '09:00', end: '12:00', title: 'Rumba Time', host: 'DJ Fiston', description: 'Rumba centrafricaine et congolaise, des classiques aux nouvelles sorties.' },
{ id: 'journal-culturel', days: [1, 2, 3, 4, 5], start: '12:00', end: '13:00', title: 'Le Journal culturel', host: 'Rédaction FECAM', description: 'Les informations de la fédération et de la scène musicale.' },
{ id: 'sango-hits', days: [1, 2, 3, 4, 5], start: '13:00', end: '16:00', title: 'Sango Hits', host: 'Arlette Ndoumba', description: 'Les titres chantés en sango qui font vibrer le pays.' },
{ id: 'generation-talents', days: [1, 2, 3, 4, 5], start: '16:00', end: '18:00', title: 'Génération Talents', host: 'Kévin Zanga', description: 'Découvertes, maquettes et jeunes artistes accompagnés par la FECAM.' },
{ id: 'grand-direct', days: [1, 2, 3, 4, 5], start: '18:00', end: '20:00', title: 'Le Grand Direct', host: 'Serge Yakité', description: 'Interviews d’artistes et sessions acoustiques en studio.' },
{ id: 'samedi-tradition', days: [6], start: '06:00', end: '10:00', title: 'Samedi Tradition', host: 'Papa Célestin Doko', description: 'Musiques traditionnelles des seize préfectures.' },
{ id: 'hit-parade', days: [6], start: '10:00', end: '14:00', title: 'Le Hit-Parade FECAM', host: 'DJ Fiston', description: 'Le classement de la semaine, voté par les auditeurs.' },
{ id: 'samedi-live', days: [6], start: '14:00', end: '20:00', title: 'Samedi Live', host: 'Rédaction FECAM', description: 'Concerts enregistrés lors des événements de la fédération.' },
{ id: 'gospel-dimanche', days: [0], start: '06:00', end: '11:00', title: 'Gospel Dimanche', host: 'Sœurs Ndomalé', description: 'Chorales et gospel centrafricain.' },
{ id: 'memoire-rumba', days: [0], start: '11:00', end: '15:00', title: 'Mémoire de la Rumba', host: 'Serge Yakité', description: 'Archives et grands orchestres des années 60 à 90.' },
{ id: 'dimanche-famille', days: [0], start: '15:00', end: '20:00', title: 'Dimanche en famille', host: 'Marcelle Kossi', description: 'Dédicaces, souvenirs et musiques pour toutes les générations.' },
{ id: 'nuits-centrafricaines', days: [0, 1, 2, 3, 4, 5, 6], start: '20:00', end: '24:00', title: 'Nuits Centrafricaines', host: 'Arlette Ndoumba', description: 'Ambiances du soir et dédicaces des auditeurs.' }];


export const radioDays = [
{ day: 1, short: 'Lun', label: 'Lundi' },
{ day: 2, short: 'Mar', label: 'Mardi' },
{ day: 3, short: 'Mer', label: 'Mercredi' },
{ day: 4, short: 'Jeu', label: 'Jeudi' },
{ day: 5, short: 'Ven', label: 'Vendredi' },
{ day: 6, short: 'Sam', label: 'Samedi' },
{ day: 0, short: 'Dim', label: 'Dimanche' }];