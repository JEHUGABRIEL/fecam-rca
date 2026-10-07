import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, Loader2Icon, MapPinIcon, TicketIcon } from 'lucide-react';
import { EventRow } from '../components/EventRow';
import { FormField } from '../components/FormField';
import { FormStatus } from '../components/FormStatus';
import { easeOut, MaskedLines, Reveal } from '../components/Reveal';
import { useEvents } from '../hooks/data';
import { useSubmit } from '../hooks/useSubmit';
import { Honeypot } from '../components/Honeypot';
import { MemberCta } from '../components/MemberCta';
import { LoadError } from '../components/LoadError';
import { PageLoader } from '../components/LoadingScreen';
import { formatDateRange, isPastDate } from '../utils/date';

export function EventDetail() {
  const { id } = useParams();
  const { data: events, loading, failed, refresh } = useEvents();
  const event = events.find((e) => e.id === id);
  const { state, message, submit, reset } = useSubmit('reservations');

  // Tant que la liste charge, l'événement n'est pas « introuvable »
  if (!event && loading) return <PageLoader />;
  if (!event && failed) return <LoadError onRetry={refresh} what="cet événement" />;

  if (!event) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="font-poster text-5xl uppercase">Événement introuvable</h1>
        <p className="mt-3 text-fecam-black/60">Cet événement n’existe pas ou a été retiré de l’agenda.</p>
        <Link to="/evenements" className="btn-dark mt-8">Retour à l’agenda</Link>
      </section>);

  }

  const past = isPastDate(event.endDate ?? event.date);
  const others = events.filter((e) => e.id !== event.id && !isPastDate(e.endDate ?? e.date)).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  const details = [
  { icon: CalendarIcon, label: 'Date', value: formatDateRange(event.date, event.endDate) },
  { icon: ClockIcon, label: 'Heure', value: event.time },
  { icon: MapPinIcon, label: 'Lieu', value: `${event.venue}, ${event.city}` },
  { icon: TicketIcon, label: 'Tarif', value: event.price }];


  return (
    <article>
      {/* En-tête : grande image, titre posé dessus */}
      <header className="grain relative overflow-hidden bg-fecam-black text-fecam-paper">
        <motion.img
          src={event.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: easeOut }} />
        
        <div className="absolute inset-0 bg-gradient-to-t from-fecam-black via-fecam-black/60 to-fecam-black/20" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-14 pt-10 lg:px-8 lg:pb-20 lg:pt-12">
          <Link to="/evenements" className="link-draw text-fecam-paper/80 hover:text-fecam-paper">
            <ArrowLeftIcon className="h-4 w-4" /> Tous les événements
          </Link>
          <p className="mt-24 text-xs font-semibold uppercase tracking-[0.2em] text-fecam-orange lg:mt-36">
            {event.category} · {formatDateRange(event.date, event.endDate)}
          </p>
          <h1 className="mt-3 max-w-4xl font-poster text-5xl uppercase leading-[0.95] lg:text-7xl">
            <MaskedLines lines={[event.title]} delay={0.1} />
          </h1>
          <motion.p
            className="mt-5 max-w-2xl text-lg text-fecam-paper/75"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: easeOut }}>
            
            {event.summary}
          </motion.p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 lg:grid-cols-[1.5fr_1fr] lg:px-8 lg:py-24">
        <Reveal>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-fecam-clay">À propos de l’événement</h2>
          <p className="mt-4 font-serif text-2xl italic leading-snug lg:text-[1.75rem]">{event.description}</p>

          <dl className="mt-10 grid gap-x-10 sm:grid-cols-2">
            {details.map(({ icon: Icon, label, value }) =>
            <div key={label} className="flex gap-4 border-t border-fecam-black/10 py-5">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-fecam-orange" />
                <div>
                  <dt className="text-sm text-fecam-black/55">{label}</dt>
                  <dd className="mt-0.5 font-semibold first-letter:uppercase">{value}</dd>
                </div>
              </div>
            )}
          </dl>
        </Reveal>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          {past ?
          <div className="rounded-3xl bg-fecam-sand p-8">
              <h2 className="font-display text-xl font-bold">Événement terminé</h2>
              <p className="mt-2 text-fecam-black/65">Retrouvez les temps forts dans nos actualités et sur Radio FECAM.</p>
            </div> :
          state === 'success' ?
          <FormStatus title="Place réservée" message="Vous recevrez une confirmation par SMS avant l’événement." onReset={reset} resetLabel="Faire une autre réservation" /> :

          <Reveal delay={0.1}>
          <form
            onSubmit={(e) => {
              const f = new FormData(e.currentTarget);
              submit(e, { event_id: event.id, event_title: event.title, name: f.get('nom'), phone: f.get('telephone'), seats: f.get('places') });
            }}
            className="relative rounded-3xl bg-fecam-sand p-6 lg:p-8">
              <Honeypot />
              <h2 className="font-display text-2xl font-bold">Réserver ma place</h2>
              <p className="mt-1 text-sm text-fecam-black/60">{event.price}</p>
              <div className="mt-6 space-y-4">
                <FormField id="nom" label="Nom complet" required />
                <FormField id="telephone" label="Téléphone" type="tel" required placeholder="+236 …" />
                <FormField id="places" label="Nombre de places" options={['1', '2', '3', '4', '5']} />
              </div>
              <button
              type="submit"
              disabled={state === 'submitting'}
              className="btn-dark mt-6 w-full disabled:opacity-70">
              
                {state === 'submitting' && <Loader2Icon className="h-4 w-4 animate-spin" />}
                {state === 'submitting' ? 'Envoi…' : 'Confirmer la réservation'}
              </button>
              {state === 'error' && <p className="mt-3 text-sm font-semibold text-red-700" role="alert">{message}</p>}
            </form>
          </Reveal>
          }
        </aside>
      </div>

      {others.length > 0 &&
      <section className="border-t border-fecam-black/10">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <h2 className="font-poster text-4xl uppercase lg:text-5xl">À venir aussi</h2>
            <div className="mt-8 border-t border-fecam-black/10">
              {others.map((e) =>
            <EventRow key={e.id} event={e} />
            )}
            </div>
          </div>
        </section>
      }
      <MemberCta />
    </article>);

}