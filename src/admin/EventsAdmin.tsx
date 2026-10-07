import { eventCategories } from '../data/events';
import { AdminCrudPage, FieldDef } from './AdminCrudPage';

interface EventRow {
  id: string;
  title: string;
  category: string;
  date: string;
  end_date: string | null;
  time: string;
  venue: string;
  city: string;
  price: string;
  image: string;
  summary: string;
  description: string;
}

const fields: FieldDef[] = [
{ key: 'title', label: 'Titre', required: true, fullWidth: true },
{ key: 'category', label: 'Catégorie', type: 'select', options: eventCategories, required: true },
{ key: 'date', label: 'Date de début', type: 'date', required: true },
{ key: 'end_date', label: 'Date de fin (optionnel)', type: 'date' },
{ key: 'time', label: 'Heure', required: true },
{ key: 'venue', label: 'Lieu', required: true },
{ key: 'city', label: 'Ville', required: true },
{ key: 'price', label: 'Tarif', required: true },
{ key: 'image', label: 'Image', type: 'image' },
{ key: 'summary', label: 'Résumé (une phrase)', type: 'textarea', fullWidth: true },
{ key: 'description', label: 'Description complète', type: 'textarea', fullWidth: true, required: true }];


export function EventsAdmin() {
  return (
    <AdminCrudPage<EventRow>
      title="Événements"
      description="Concerts, festivals, formations et concours affichés dans l’agenda du site."
      table="events"
      fields={fields}
      columns={[
      { key: 'title', label: 'Titre' },
      { key: 'category', label: 'Catégorie' },
      { key: 'date', label: 'Date' },
      { key: 'city', label: 'Ville' }]
      } />);


}
