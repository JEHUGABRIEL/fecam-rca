import { Release } from '../types/content';

// Exemples affichés tant que le back-office ne contient pas de sorties : à remplacer par les
// vrais titres (les liens pointent vers une recherche YouTube / Spotify).
const search = (q: string) => ({
  youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
  spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(q)}`
});

export const releases: Release[] = [
{ id: 'bangui-by-night', title: 'Bangui by Night', artist: 'Aubin Ngaïkoumon', cover: '/d7319ba3-69af-48dd-b9b4-ec2ac34c91e0.jpg', releaseDate: '2026-09-26', ...search('Aubin Ngaïkoumon Bangui by Night') },
{ id: 'lengo-songo', title: 'Lêngö Söngö', artist: 'Grâce Yangué', cover: '/a6e83fee-0fcc-4e91-934c-8b66648163b2.jpg', releaseDate: '2026-09-12', ...search('Grâce Yangué Lêngö Söngö') },
{ id: 'guitare-ya-kala', title: 'Guitare ya kala', artist: 'Papa Célestin Doko', cover: '/d0f0cf1f-9342-44fa-9bc3-dce2e8d03a52.jpg', releaseDate: '2026-08-29', ...search('Papa Célestin Doko Guitare ya kala') },
{ id: 'kodro', title: 'Kodro', artist: 'K-Zanga', cover: '/9907c679-61a9-4029-ba5e-5aa0f31f5a10.jpg', releaseDate: '2026-08-15', ...search('K-Zanga Kodro') },
{ id: 'ngombi-live', title: 'Ngombi (live à Mobaye)', artist: 'Ensemble Ngombi de Mobaye', cover: '/284641d1-22c9-46e6-a917-0d6552095e4f.jpg', releaseDate: '2026-07-30', ...search('Ensemble Ngombi de Mobaye') }];
