import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarXIcon, SearchIcon } from 'lucide-react';
import { EventRow } from '../components/EventRow';
import { FilterChips } from '../components/FilterChips';
import { PageHeader } from '../components/PageHeader';
import { MemberCta } from '../components/MemberCta';
import { easeOut } from '../components/Reveal';
import { eventCategories } from '../data/events';
import { useEvents } from '../hooks/data';
import { groupByMonth, isPastDate } from '../utils/date';

type Period = 'À venir' | 'Passés';

export function Events() {
  const { data: events } = useEvents();
  const [period, setPeriod] = useState<Period>('À venir');
  const [category, setCategory] = useState('Tous');
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = events.
    filter((e) => {
      const past = isPastDate(e.endDate ?? e.date);
      if (period === 'À venir' ? past : !past) return false;
      if (category !== 'Tous' && e.category !== category) return false;
      if (q && !`${e.title} ${e.city} ${e.venue}`.toLowerCase().includes(q)) return false;
      return true;
    }).
    sort((a, b) => period === 'À venir' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
    return groupByMonth(filtered);
  }, [events, period, category, query]);

  return (
    <>
      <PageHeader kicker="L’agenda de la fédération" title="Événements" description="Concerts, festivals, formations, concours et rencontres professionnelles partout en Centrafrique." />

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-6 border-b border-fecam-black/10 pb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div role="tablist" aria-label="Période" className="relative inline-flex w-fit rounded-full bg-fecam-sand p-1">
              {(['À venir', 'Passés'] as Period[]).map((p) =>
              <button
                key={p}
                role="tab"
                aria-selected={period === p}
                onClick={() => setPeriod(p)}
                className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300 ${period === p ? 'text-fecam-paper' : 'text-fecam-black/65 hover:text-fecam-black'}`}>
                
                  {/* Pastille qui glisse d'un onglet à l'autre */}
                  {period === p &&
                  <motion.span layoutId="period-pill" className="absolute inset-0 -z-0 rounded-full bg-fecam-black" transition={{ duration: 0.5, ease: easeOut }} />
                  }
                  <span className="relative">{p}</span>
                </button>
              )}
            </div>
            <div className="relative md:w-80">
              <label htmlFor="recherche-evenement" className="sr-only">Rechercher un événement</label>
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fecam-black/60" />
              <input
                id="recherche-evenement"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Titre, ville, lieu…"
                className="w-full rounded-full border border-fecam-black/[0.12] bg-white/70 py-2.5 pl-11 pr-4 text-sm placeholder:text-fecam-black/40 transition-[border-color,background-color] duration-300 focus:border-fecam-black/40 focus:bg-white focus:outline-none" />
              
            </div>
          </div>
          <FilterChips label="Catégorie" options={['Tous', ...eventCategories]} value={category} onChange={setCategory} />
        </div>

        {groups.length === 0 ?
        <div className="py-20 text-center">
            <CalendarXIcon className="mx-auto h-10 w-10 text-fecam-black/35" />
            <p className="mt-4 font-display text-xl font-bold">Aucun événement ne correspond</p>
            <p className="mt-1 text-fecam-black/60">Essayez une autre catégorie ou effacez la recherche.</p>
            <button
            type="button"
            onClick={() => {setCategory('Tous');setQuery('');}}
            className="btn-ghost mt-6">
            
              Réinitialiser les filtres
            </button>
          </div> :

        // Les résultats se recomposent en fondu à chaque changement de filtre
        <AnimatePresence mode="wait">
            <motion.div
            key={`${period}-${category}-${query}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}>
            
              {groups.map((group) =>
            <div key={group.key} className="mt-14">
                  <h2 className="font-poster text-3xl uppercase lg:text-4xl">{group.label}</h2>
                  <div className="mt-4 border-t border-fecam-black/10">
                    {group.items.map((event) =>
                <EventRow key={event.id} event={event} muted={period === 'Passés'} />
                )}
                  </div>
                </div>
            )}
            </motion.div>
          </AnimatePresence>
        }
      </section>

      <MemberCta />
    </>);

}