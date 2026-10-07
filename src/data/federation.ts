import { MembershipPlan } from '../types/content';

export const missions = [
{ title: 'Promouvoir', text: 'Faire connaître la musique centrafricaine au pays et à l’international, par nos événements et par Radio FECAM.' },
{ title: 'Former', text: 'Organiser des ateliers, masterclasses et formations aux métiers de la musique pour les artistes et techniciens.' },
{ title: 'Protéger', text: 'Accompagner les membres dans la déclaration de leurs œuvres et la défense de leurs droits d’auteur.' },
{ title: 'Rassembler', text: 'Fédérer artistes, groupes, associations et structures professionnelles autour d’une voix commune.' }];


export const board = [
{ name: 'Saint Juste Guérembezi', role: 'Président' },
{ name: 'Marcelle Kossi', role: 'Vice-présidente, chargée de la communication' },
{ name: 'Serge Yakité', role: 'Secrétaire général' },
{ name: 'Arlette Ndoumba', role: 'Trésorière' },
{ name: 'Papa Célestin Doko', role: 'Conseiller, formation et patrimoine' }];


export const presidentMessage = {
  name: 'Saint Juste Guérembezi',
  role: 'Président de la FECAM',
  // Photo officielle du Président (public/president.jpg)
  image: '/president.jpg',
  message: 'La musique centrafricaine porte l’âme de notre pays. À la FECAM, notre mission est de rassembler chaque artiste, chaque groupe et chaque structure autour d’un même projet : faire rayonner ce patrimoine, protéger ceux qui le créent et ouvrir la voie aux jeunes talents. Radio FECAM n’est qu’une étape ; ensemble, nous irons plus loin.'
};


export const membershipPlans: MembershipPlan[] = [
{ id: 'artiste', name: 'Artiste individuel', price: '10 000 FCFA / an', audience: 'Chanteurs, musiciens, auteurs-compositeurs', features: ['Carte de membre', 'Inscription à l’annuaire des artistes', 'Accompagnement droits d’auteur', 'Tarif réduit aux formations', 'Diffusion possible sur Radio FECAM'] },
{ id: 'groupe', name: 'Groupe ou orchestre', price: '25 000 FCFA / an', audience: 'Formations de 2 musiciens et plus', features: ['Cartes pour tous les membres du groupe', 'Fiche groupe dans l’annuaire', 'Candidature prioritaire aux scènes FECAM', 'Tarif réduit aux formations', 'Diffusion possible sur Radio FECAM'] },
{ id: 'structure', name: 'Association ou structure', price: '50 000 FCFA / an', audience: 'Associations, labels, studios, salles', features: ['Droit de vote à l’assemblée générale', 'Visibilité sur le site et la radio', 'Co-organisation d’événements', 'Accès aux rencontres professionnelles', 'Accompagnement administratif'] }];


export const partners = ['Ministère des Arts et de la Culture', 'Bureau centrafricain du droit d’auteur', 'Alliance Française de Bangui', 'Mairie de Bangui', 'Conservatoire de musique'];