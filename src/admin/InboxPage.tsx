import { useMemo, useState } from 'react';
import { MailIcon, PhoneIcon, Trash2Icon } from 'lucide-react';
import { useAdminTable } from '../hooks/useAdminTable';
import { FilterChips } from '../components/FilterChips';
import { useConfirm } from './ui/ConfirmDialog';
import { IconButton } from './ui/IconButton';
import { Pagination, usePagination } from './ui/Pagination';

type Row = {id: string;status?: string;created_at: string;} & Record<string, unknown>;

export interface InboxConfig {
  title: string;
  description: string;
  table: string;
  // Statuts possibles (le premier = « à traiter ») ; absent = pas de suivi (ex. newsletter)
  statuses?: string[];
  heading: (r: Row) => string;
  subheading?: (r: Row) => string | null;
  body?: (r: Row) => string | null;
}

const formatDate = (iso: string) =>
new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// Liste des envois du public, filtrable par statut
export function InboxPage({ title, description, table, statuses, heading, subheading, body }: InboxConfig) {
  const { data, loading, error, update, remove } = useAdminTable<Row>(table);
  const [filter, setFilter] = useState('Tous');
  const confirm = useConfirm();
  const rows = useMemo(() => filter === 'Tous' ? data : data.filter((r) => r.status === filter), [data, filter]);
  const pagination = usePagination(rows, 8);

  const handleDelete = async (r: Row) => {
    const ok = await confirm({
      title: 'Supprimer cet envoi ?',
      message: `L’envoi de « ${heading(r)} » sera supprimé définitivement. Cette action est irréversible.`,
      confirmLabel: 'Supprimer'
    });
    if (ok) await remove(r.id);
  };

  return (
    <div>
      <h1 className="font-poster text-4xl uppercase">{title}</h1>
      <p className="mt-1 text-sm text-fecam-black/60">{description}</p>

      {statuses &&
      <div className="mt-6">
          <FilterChips
          label="Statut"
          options={['Tous', ...statuses]}
          value={filter}
          onChange={setFilter} />
        
        </div>
      }
      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</p>}

      <div className="mt-6 space-y-3">
        {loading ?
        <p className="text-sm text-fecam-black/50">Chargement…</p> :
        rows.length === 0 ?
        <p className="rounded-2xl border border-dashed border-fecam-black/15 p-8 text-center text-sm text-fecam-black/50">Rien ici pour le moment.</p> :

        pagination.pageItems.map((r) => {
          const fresh = statuses && r.status === statuses[0];
          const email = typeof r.email === 'string' ? r.email : null;
          const phone = typeof r.phone === 'string' ? r.phone : null;
          return (
            <article key={r.id} className={`rounded-2xl border bg-white p-5 ${fresh ? 'border-fecam-orange/50' : 'border-fecam-black/10'}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-display text-lg font-bold">
                      {fresh && <span className="h-2 w-2 rounded-full bg-fecam-orange" aria-label="À traiter" />}
                      {heading(r)}
                    </p>
                    {subheading?.(r) && <p className="text-sm text-fecam-black/60">{subheading(r)}</p>}
                    <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      {phone && <a href={`tel:${phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 hover:underline"><PhoneIcon className="h-3.5 w-3.5" />{phone}</a>}
                      {email && heading(r) !== email && <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 hover:underline"><MailIcon className="h-3.5 w-3.5" />{email}</a>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-fecam-black/45">{formatDate(r.created_at)}</span>
                    {statuses &&
                  <select
                    value={r.status}
                    onChange={(e) => update(r.id, { status: e.target.value })}
                    aria-label="Statut"
                    className="rounded-full border border-fecam-black/15 bg-white px-3 py-1.5 text-sm font-medium">
                    
                        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                  }
                    <IconButton label="Supprimer" tone="danger" onClick={() => handleDelete(r)}>
                      <Trash2Icon className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
                {body?.(r) && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-fecam-black/75">{body(r)}</p>}
              </article>);

        })
        }
      </div>
      <Pagination
        page={pagination.page}
        pageCount={pagination.pageCount}
        onChange={pagination.setPage}
        from={pagination.from}
        to={pagination.to}
        total={pagination.total} />
      
    </div>);

}

const str = (v: unknown) => typeof v === 'string' && v ? v : null;

export const inboxes: Record<string, InboxConfig> = {
  adhesions: {
    title: 'Demandes d’adhésion',
    description: 'Envoyées depuis la page « Devenir membre ».',
    table: 'membership_requests',
    statuses: ['nouveau', 'contacté', 'validé', 'refusé'],
    heading: (r) => `${r.name} — ${r.plan}`,
    subheading: (r) => [str(r.city), str(r.genre)].filter(Boolean).join(' · '),
    body: (r) => str(r.presentation)
  },
  messages: {
    title: 'Messages',
    description: 'Envoyés depuis la page Contact.',
    table: 'contact_messages',
    statuses: ['non lu', 'lu', 'traité'],
    heading: (r) => String(r.name),
    subheading: (r) => str(r.subject),
    body: (r) => str(r.message)
  },
  reservations: {
    title: 'Réservations',
    description: 'Places réservées depuis les pages des événements.',
    table: 'reservations',
    statuses: ['nouvelle', 'confirmée', 'annulée'],
    heading: (r) => `${r.name} — ${r.seats} place${Number(r.seats) > 1 ? 's' : ''}`,
    subheading: (r) => str(r.event_title)
  },
  dedicaces: {
    title: 'Dédicaces',
    description: 'Envoyées par les auditeurs depuis la page Radio.',
    table: 'dedications',
    statuses: ['nouvelle', 'diffusée', 'écartée'],
    heading: (r) => String(r.name),
    subheading: (r) => [str(r.city), str(r.song) && `Titre : ${r.song}`].filter(Boolean).join(' · '),
    body: (r) => str(r.message)
  },
  newsletter: {
    title: 'Newsletter',
    description: 'Adresses inscrites depuis le pied de page du site.',
    table: 'newsletter_subscribers',
    heading: (r) => String(r.email)
  }
};

export const MembershipInbox = () => <InboxPage {...inboxes.adhesions} />;
export const MessagesInbox = () => <InboxPage {...inboxes.messages} />;
export const ReservationsInbox = () => <InboxPage {...inboxes.reservations} />;
export const DedicationsInbox = () => <InboxPage {...inboxes.dedicaces} />;
export const NewsletterInbox = () => <InboxPage {...inboxes.newsletter} />;
