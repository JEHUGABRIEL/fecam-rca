import { AdminCrudPage, FieldDef } from './AdminCrudPage';

interface RadioShowRow {
  id: string;
  title: string;
  host: string;
  start: string;
  end: string;
  days: number[];
  description: string;
}

const fields: FieldDef[] = [
{ key: 'title', label: 'Titre de l’émission', required: true },
{ key: 'host', label: 'Animateur·rice', required: true },
{ key: 'start', label: 'Heure de début', type: 'time', required: true },
{ key: 'end', label: 'Heure de fin', required: true, placeholder: 'HH:MM', hint: '« 24:00 » pour une émission qui finit à minuit.' },
{ key: 'days', label: 'Jours de diffusion', required: true, fullWidth: true, placeholder: '1, 2, 3, 4, 5', hint: '0 = dimanche, 1 = lundi … 6 = samedi, séparés par des virgules.' },
{ key: 'description', label: 'Description', type: 'textarea', fullWidth: true }];


export function RadioAdmin() {
  return (
    <AdminCrudPage<RadioShowRow>
      title="Grille des programmes"
      description="Émissions diffusées sur Radio FECAM, avec leurs jours et horaires de passage."
      table="radio_shows"
      itemLabel="une émission"
      describe={(r) => r.title}
      fields={fields}
      fromRow={(row) => ({ ...row, days: row.days.join(', ') } as unknown as Record<string, string>)}
      columns={[
      { key: 'title', label: 'Émission' },
      { key: 'host', label: 'Animateur·rice' },
      { key: 'start', label: 'Début' },
      { key: 'end', label: 'Fin' }]
      } />);


}
