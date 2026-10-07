import { EventCategory, EventItem } from '../types/content';

export const eventCategories: EventCategory[] = ['Concert', 'Festival', 'Formation', 'Concours', 'Conférence'];

export const events: EventItem[] = [
{
  id: 'concert-lancement-radio-fecam',
  title: 'Concert de lancement de Radio FECAM',
  category: 'Concert',
  date: '2026-10-03',
  time: '18h00',
  venue: 'Alliance Française de Bangui',
  city: 'Bangui',
  price: 'Entrée libre',
  image: "/dacd9262-95f8-4b19-8739-ed4ba8b7e331.jpg",
  summary: 'Une soirée pour célébrer la naissance de la radio de la fédération, retransmise en direct.',
  description:
  'Pour fêter le lancement officiel de Radio FECAM, la fédération réunit sur scène plusieurs artistes membres : rumba, afro-pop, rap et musiques traditionnelles. Le concert est retransmis en direct sur la radio. Les portes ouvrent à 17h30.'
},
{
  id: 'atelier-droits-auteur',
  title: 'Atelier : droits d’auteur et gestion collective',
  category: 'Conférence',
  date: '2026-10-10',
  time: '09h00',
  venue: 'Maison de la Culture',
  city: 'Bangui',
  price: 'Gratuit sur inscription',
  image: "/82ddd7e9-9900-4b31-a453-ee32f46bd22c.jpg",
  summary: 'Comprendre comment protéger ses œuvres et percevoir ses droits.',
  description:
  'Un atelier pratique animé avec le Bureau centrafricain du droit d’auteur : déclaration des œuvres, contrats d’édition, diffusion radio et plateformes de streaming. Réservé aux artistes membres et aux structures affiliées.'
},
{
  id: 'nuit-musiques-traditionnelles',
  title: 'Nuit des musiques traditionnelles',
  category: 'Concert',
  date: '2026-10-17',
  time: '19h00',
  venue: 'Place de la Mairie',
  city: 'Berbérati',
  price: '1 000 FCFA',
  image: "/284641d1-22c9-46e6-a917-0d6552095e4f.jpg",
  summary: 'Balafons, ngombi et tambours : une nuit dédiée au patrimoine musical des régions.',
  description:
  'Des ensembles venus de la Mambéré-Kadéï, de la Lobaye et de la Basse-Kotto se succèdent pour faire découvrir les répertoires traditionnels centrafricains. Une soirée organisée avec les associations culturelles locales.'
},
{
  id: 'masterclass-guitare-soukous',
  title: 'Masterclass guitare : rumba et soukous',
  category: 'Formation',
  date: '2026-10-24',
  time: '14h00',
  venue: 'Conservatoire de musique',
  city: 'Bangui',
  price: '5 000 FCFA',
  image: "/82ddd7e9-9900-4b31-a453-ee32f46bd22c.jpg",
  summary: 'Trois heures de pratique avec des guitaristes de la scène centrafricaine.',
  description:
  'Techniques de guitare solo et d’accompagnement propres à la rumba centrafricaine et au soukous. Places limitées à 25 participants. Apportez votre instrument ; quelques guitares sont mises à disposition.'
},
{
  id: 'festival-international-bangui-2026',
  title: 'Festival International de Musique de Bangui',
  category: 'Festival',
  date: '2026-11-12',
  endDate: '2026-11-15',
  time: '16h00',
  venue: 'Stade Barthélemy Boganda',
  city: 'Bangui',
  price: '2 000 FCFA / jour',
  image: "/54c1cc5b-ae8e-4fb5-9daa-81fd4c30e5a8.jpg",
  summary: 'Quatre jours de concerts avec des artistes de toute l’Afrique centrale.',
  description:
  'Le rendez-vous annuel de la fédération. Plus de trente artistes et groupes, un village des métiers de la musique, des rencontres professionnelles et une scène découverte pour les jeunes talents.'
},
{
  id: 'concours-jeunes-talents-2026',
  title: 'Finale du Concours Jeunes Talents FECAM',
  category: 'Concours',
  date: '2026-12-05',
  time: '15h00',
  venue: 'Palais de la Jeunesse',
  city: 'Bangui',
  price: '1 500 FCFA',
  image: "/dacd9262-95f8-4b19-8739-ed4ba8b7e331.jpg",
  summary: 'Dix finalistes de moins de 25 ans se disputent un enregistrement professionnel.',
  description:
  'Après les présélections régionales, les dix finalistes interprètent deux titres devant un jury d’artistes et de professionnels. Le lauréat remporte l’enregistrement d’un EP et une diffusion sur Radio FECAM.'
},
{
  id: 'tournee-regionale-bambari',
  title: 'Tournée régionale : étape de Bambari',
  category: 'Concert',
  date: '2027-01-16',
  time: '17h00',
  venue: 'Terrain municipal',
  city: 'Bambari',
  price: 'Entrée libre',
  image: "/284641d1-22c9-46e6-a917-0d6552095e4f.jpg",
  summary: 'La fédération emmène ses artistes à la rencontre du public de la Ouaka.',
  description:
  'Première étape de la tournée régionale 2027 : concert gratuit, ateliers pour les musiciens locaux et enregistrement d’une émission spéciale de Radio FECAM.'
},
{
  id: 'assemblee-generale-2026',
  title: 'Assemblée générale ordinaire',
  category: 'Conférence',
  date: '2026-08-29',
  time: '09h00',
  venue: 'Siège de la FECAM',
  city: 'Bangui',
  price: 'Réservé aux membres',
  image: "/82ddd7e9-9900-4b31-a453-ee32f46bd22c.jpg",
  summary: 'Bilan de l’année et adoption du programme 2026-2027.',
  description:
  'Les membres ont adopté le rapport moral et financier ainsi que le programme d’activités, dont le lancement de Radio FECAM et la tournée régionale.'
},
{
  id: 'fete-de-la-musique-2026',
  title: 'Fête de la Musique 2026',
  category: 'Festival',
  date: '2026-06-21',
  time: '15h00',
  venue: 'Plusieurs scènes en ville',
  city: 'Bangui',
  price: 'Entrée libre',
  image: "/54c1cc5b-ae8e-4fb5-9daa-81fd4c30e5a8.jpg",
  summary: 'Six scènes et plus de quarante groupes dans les quartiers de Bangui.',
  description:
  'La FECAM a coordonné six scènes ouvertes dans les arrondissements de Bangui, avec plus de quarante groupes amateurs et professionnels.'
}];