import { Artist } from '../types/content';

export const artistGenres = ['Rumba & soukous', 'Afro-pop', 'Rap & hip-hop', 'Traditionnel', 'Gospel', 'Orchestre'];

export const artists: Artist[] = [
{ id: 'aubin-ngaikoumon', name: 'Aubin Ngaïkoumon', kind: 'Artiste', genre: 'Rumba & soukous', city: 'Bangui', image: "/d7319ba3-69af-48dd-b9b4-ec2ac34c91e0.jpg", bio: 'Chanteur et auteur-compositeur, il a sorti trois albums et tourne régulièrement en Afrique centrale.', featured: true },
{ id: 'grace-yangue', name: 'Grâce Yangué', kind: 'Artiste', genre: 'Afro-pop', city: 'Bangui', image: "/a6e83fee-0fcc-4e91-934c-8b66648163b2.jpg", bio: 'Révélée par le Concours Jeunes Talents, elle mêle afro-pop et chant en sango.', featured: true },
{ id: 'celestin-doko', name: 'Papa Célestin Doko', kind: 'Artiste', genre: 'Rumba & soukous', city: 'Bimbo', image: "/d0f0cf1f-9342-44fa-9bc3-dce2e8d03a52.jpg", bio: 'Guitariste des grands orchestres des années 80, il transmet aujourd’hui son savoir aux jeunes musiciens.', featured: true },
{ id: 'k-zanga', name: 'K-Zanga', kind: 'Artiste', genre: 'Rap & hip-hop', city: 'Bangui', image: "/9907c679-61a9-4029-ba5e-5aa0f31f5a10.jpg", bio: 'Rappeur et producteur, il anime l’émission Génération Talents sur Radio FECAM.', featured: true },
{ id: 'ensemble-ngombi-mobaye', name: 'Ensemble Ngombi de Mobaye', kind: 'Groupe', genre: 'Traditionnel', city: 'Mobaye', bio: 'Groupe de harpes ngombi et de percussions perpétuant les répertoires de la Basse-Kotto.' },
{ id: 'soeurs-ndomale', name: 'Sœurs Ndomalé', kind: 'Groupe', genre: 'Gospel', city: 'Bangui', bio: 'Trio vocal gospel, connu pour ses harmonies a cappella et ses concerts caritatifs.' },
{ id: 'centrafrique-jazz-ng', name: 'Centrafrique Jazz Nouvelle Génération', kind: 'Groupe', genre: 'Orchestre', city: 'Bangui', bio: 'Orchestre de douze musiciens qui revisite le répertoire des orchestres historiques.' },
{ id: 'rosine-gbazi', name: 'Rosine Gbazi', kind: 'Artiste', genre: 'Traditionnel', city: 'Berbérati', bio: 'Chanteuse de motenguene, elle collecte et enregistre les chants de sa région.' }];