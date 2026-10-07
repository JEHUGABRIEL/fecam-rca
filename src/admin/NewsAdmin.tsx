import { newsCategories } from '../data/news';
import { AdminCrudPage, FieldDef } from './AdminCrudPage';

interface NewsRow {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
}

const fields: FieldDef[] = [
{ key: 'title', label: 'Titre', required: true, fullWidth: true },
{ key: 'category', label: 'Rubrique', type: 'select', options: newsCategories, required: true },
{ key: 'date', label: 'Date', type: 'date', required: true },
{ key: 'image', label: 'Image', type: 'image' },
{ key: 'excerpt', label: 'Résumé', type: 'textarea', fullWidth: true, required: true }];


export function NewsAdmin() {
  return (
    <AdminCrudPage<NewsRow>
      title="Actualités"
      description="Articles affichés sur la page Actualités et en avant sur la page d’accueil."
      table="news"
      itemLabel="un article"
      describe={(n) => n.title}
      fields={fields}
      columns={[
      { key: 'title', label: 'Titre' },
      { key: 'category', label: 'Rubrique' },
      { key: 'date', label: 'Date' }]
      } />);


}
