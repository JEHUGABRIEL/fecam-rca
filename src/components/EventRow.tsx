import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { EventItem } from '../types/content';
import { formatDay, formatMonthShort } from '../utils/date';

interface EventRowProps {
  event: EventItem;
  muted?: boolean;
}

// Ligne d'agenda façon programme de salle : date en grand, survol discret.
export function EventRow({ event, muted = false }: EventRowProps) {
  return (
    <Link
      to={`/evenements/${event.id}`}
      className={`group relative isolate grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 border-b border-fecam-black/10 py-6 sm:grid-cols-[7rem_1fr_auto] sm:gap-8 ${
      muted ? 'opacity-60' : ''}`
      }>
      
      {/* Fond qui se déploie au survol */}
      <span
        className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-fecam-sand transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
        aria-hidden="true" />
      
      <div className="leading-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3">
        <span className="block font-poster text-5xl sm:text-6xl">{formatDay(event.date)}</span>
        <span className="mt-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-fecam-clay">{formatMonthShort(event.date)}</span>
      </div>
      <div className="min-w-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fecam-clay">
          {event.category}
          {event.endDate && <span className="text-fecam-black/45"> · Sur plusieurs jours</span>}
        </p>
        <h3 className="mt-1.5 font-display text-xl font-bold leading-snug sm:text-2xl">{event.title}</h3>
        <p className="mt-1 truncate text-sm text-fecam-black/60">
          {event.time} · {event.venue}, {event.city}
        </p>
      </div>
      <span className="mr-2 flex h-11 w-11 items-center justify-center rounded-full border border-fecam-black/15 transition-[background-color,border-color,color] duration-300 group-hover:border-fecam-black group-hover:bg-fecam-black group-hover:text-fecam-paper sm:mr-4">
        <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-45" />
      </span>
    </Link>);

}
