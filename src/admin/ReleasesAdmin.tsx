import { AdminCrudPage, FieldDef } from './AdminCrudPage';

interface ReleaseRow {
  id: string;
  title: string;
  artist: string;
  cover: string;
  release_date: string;
  youtube_url: string | null;
  spotify_url: string | null;
}

const fields: FieldDef[] = [
{ key: 'title', label: 'Titre', required: true },
{ key: 'artist', label: 'Artiste ou groupe', required: true },
{ key: 'release_date', label: 'Date de sortie', type: 'date', required: true },
{ key: 'cover', label: 'Pochette', type: 'image' },
{ key: 'youtube_url', label: 'Lien YouTube', type: 'url', fullWidth: true, placeholder: 'https://www.youtube.com/watch?v=…' },
{ key: 'spotify_url', label: 'Lien Spotify', type: 'url', fullWidth: true, placeholder: 'https://open.spotify.com/track/…' }];


export function ReleasesAdmin() {
  return (
    <AdminCrudPage<ReleaseRow>
      title="Dernières sorties"
      description="Nouveaux titres affichés sur l’accueil, avec leurs liens d’écoute (au moins un des deux liens est conseillé)."
      table="releases"
      itemLabel="une sortie"
      describe={(r) => r.title}
      fields={fields}
      columns={[
      {
        key: 'cover',
        label: '',
        render: (r) => r.cover ? <img src={r.cover} alt="" className="h-10 w-10 rounded-lg object-cover" /> : null
      },
      { key: 'title', label: 'Titre' },
      { key: 'artist', label: 'Artiste' },
      { key: 'release_date', label: 'Sortie' },
      { key: 'links', label: 'Liens', render: (r) => [r.youtube_url && 'YouTube', r.spotify_url && 'Spotify'].filter(Boolean).join(' · ') || '—' }]
      } />);


}
