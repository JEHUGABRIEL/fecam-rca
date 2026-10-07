import { NewsItem } from '../types/content';

export const newsCategories = ['Radio', 'Concours', 'Institution', 'Événement', 'Formation'];

export const news: NewsItem[] = [
{ id: 'radio-fecam-en-continu', title: 'Radio FECAM émet désormais en continu', date: '2026-09-15', category: 'Radio', excerpt: 'Après plusieurs semaines de tests, la radio de la fédération diffuse 24h/24 : émissions quotidiennes, programmation 100 % centrafricaine et directs depuis nos événements.', image: "/4637acde-927f-420c-9843-7ba0e1f7d9fd.jpg" },
{ id: 'inscriptions-jeunes-talents', title: 'Les inscriptions au Concours Jeunes Talents sont ouvertes', date: '2026-09-08', category: 'Concours', excerpt: 'Les artistes de moins de 25 ans peuvent déposer leur candidature jusqu’au 20 octobre. Présélections dans cinq villes.', image: "/dacd9262-95f8-4b19-8739-ed4ba8b7e331.jpg" },
{ id: 'convention-droit-auteur', title: 'Convention signée avec le Bureau centrafricain du droit d’auteur', date: '2026-08-30', category: 'Institution', excerpt: 'Un accord pour simplifier la déclaration des œuvres des membres et améliorer la répartition des droits de diffusion.', image: "/82ddd7e9-9900-4b31-a453-ee32f46bd22c.jpg" },
{ id: 'formation-jeunes-musiciens', title: '40 jeunes musiciens accompagnés cet été', date: '2026-07-12', category: 'Formation', excerpt: 'Chant, guitare, percussions et production : bilan du programme de formation estival mené à Bangui et Berbérati.', image: "/284641d1-22c9-46e6-a917-0d6552095e4f.jpg" },
{ id: 'retour-fete-musique-2026', title: 'Retour sur la Fête de la Musique 2026', date: '2026-06-25', category: 'Événement', excerpt: 'Six scènes, plus de quarante groupes et un public nombreux dans tous les arrondissements de Bangui.', image: "/54c1cc5b-ae8e-4fb5-9daa-81fd4c30e5a8.jpg" }];