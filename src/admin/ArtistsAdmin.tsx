import { artistGenres } from '../data/artists';
import { AdminCrudPage, FieldDef } from './AdminCrudPage';

interface ArtistRow {
  id: string;
  name: string;
  kind: string;
  genre: string;
  city: string;
  image: string | null;
  bio: string;
  featured: boolean;
}

const fields: FieldDef[] = [
{ key: 'name', label: 'Nom ou nom de scène', required: true },
{ key: 'kind', label: 'Type', type: 'select', options: ['Artiste', 'Groupe'], required: true },
{ key: 'genre', label: 'Genre musical', type: 'select', options: artistGenres, required: true },
{ key: 'city', label: 'Ville', required: true },
{ key: 'image', label: 'Photo', type: 'image' },
{ key: 'bio', label: 'Biographie', type: 'textarea', fullWidth: true, required: true },
{
  key: 'featured',
  label: 'Mettre à la une sur l’accueil',
  type: 'checkbox',
  fullWidth: true,
  hint: 'Les 4 premiers artistes cochés (avec photo) apparaissent dans « Artistes à la une ».'
}];


export function ArtistsAdmin() {
  return (
    <AdminCrudPage<ArtistRow>
      title="Artistes"
      description="Artistes et groupes membres. Cochez « à la une » pour les mettre en avant sur l’accueil."
      table="artists"
      itemLabel="un artiste"
      describe={(a) => a.name}
      fields={fields}
      columns={[
      { key: 'name', label: 'Nom' },
      { key: 'genre', label: 'Genre' },
      { key: 'city', label: 'Ville' },
      { key: 'featured', label: 'À la une' }]
      } />);


}
