import { eventCategories } from '../data/events';
import { formatDateRange, isPastDate } from '../utils/date';
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


const isPast = (e: EventRow) => isPastDate(e.end_date || e.date);

function EventsTable({ past }: {past: boolean;}) {
  return (
    <AdminCrudPage<EventRow>
      title={past ? 'Événements passés' : 'Événements à venir'}
      description={
      past ?
      'Archives de l’agenda, toujours consultables sur le site (onglet « Passés »).' :
      'Concerts, festivals, formations et concours affichés dans l’agenda et sur l’accueil.'
      }
      table="events"
      fields={fields}
      filter={(e) => isPast(e) === past}
      itemLabel="un événement"
      describe={(e) => e.title}
      emptyLabel={past ? 'Aucun événement passé.' : 'Aucun événement à venir : ajoutez le prochain rendez-vous.'}
      columns={[
      { key: 'image', label: '', render: (e) => e.image ? <img src={e.image} alt="" className="h-10 w-14 rounded-lg object-cover" /> : null },
      { key: 'title', label: 'Titre' },
      { key: 'category', label: 'Catégorie' },
      { key: 'date', label: 'Date', render: (e) => formatDateRange(e.date, e.end_date || undefined) },
      { key: 'city', label: 'Ville' }]
      } />);


}

export const UpcomingEventsAdmin = () => <EventsTable past={false} />;
export const PastEventsAdmin = () => <EventsTable past />;
