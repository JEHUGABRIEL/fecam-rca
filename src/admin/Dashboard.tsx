import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from 'lucide-react';
import { useAdminTable } from '../hooks/useAdminTable';

interface Row {id: string;status?: string;}

const content = [
{ table: 'events', label: 'Événements', to: '/admin/evenements' },
{ table: 'news', label: 'Actualités', to: '/admin/actualites' },
{ table: 'releases', label: 'Sorties', to: '/admin/sorties' },
{ table: 'artists', label: 'Artistes', to: '/admin/artistes' }];


const inbox = [
{ table: 'membership_requests', label: 'Adhésions', to: '/admin/adhesions', todo: 'nouveau' },
{ table: 'contact_messages', label: 'Messages', to: '/admin/messages', todo: 'non lu' },
{ table: 'reservations', label: 'Réservations', to: '/admin/reservations', todo: 'nouvelle' },
{ table: 'dedications', label: 'Dédicaces', to: '/admin/dedicaces', todo: 'nouvelle' }];


function Card({ table, label, to, todo }: {table: string;label: string;to: string;todo?: string;}) {
  const { data, loading } = useAdminTable<Row>(table);
  const count = todo ? data.filter((d) => d.status === todo).length : data.length;
  const highlight = Boolean(todo && count > 0);
  return (
    <Link
      to={to}
      className={`group rounded-2xl border p-6 transition-colors duration-300 ${
      highlight ? 'border-fecam-orange/40 bg-fecam-orange/[0.06] hover:border-fecam-orange' : 'border-fecam-black/10 bg-white hover:border-fecam-black/40'}`
      }>
      
      <p className="flex items-center justify-between text-sm font-medium text-fecam-black/60">
        {label}
        <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </p>
      <p className="mt-3 font-poster text-5xl">{loading ? '…' : count}</p>
      <p className="mt-1 text-xs text-fecam-black/50">{todo ? 'à traiter' : 'publiés'}</p>
    </Link>);

}

export function Dashboard() {
  return (
    <div>
      <h1 className="font-poster text-4xl uppercase">Tableau de bord</h1>
      <p className="mt-1 text-sm text-fecam-black/60">Ce qui attend une réponse, et le contenu en ligne.</p>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-fecam-black/50">À traiter</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {inbox.map((c) => <Card key={c.table} {...c} />)}
      </div>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-fecam-black/50">Contenu du site</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {content.map((c) => <Card key={c.table} {...c} />)}
      </div>
    </div>);

}
