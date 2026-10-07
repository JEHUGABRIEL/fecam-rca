import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, MapPinIcon } from 'lucide-react';
import { EventItem } from '../types/content';
import { formatDay, formatMonthShort } from '../utils/date';
import { easeOut } from './Reveal';

interface HighlightsCarouselProps {
  events: EventItem[];
  intervalMs?: number;
}

// Diaporama des prochains temps forts : fondu enchaîné, progression, flèches, glisser au doigt.
export function HighlightsCarousel({ events, intervalMs = 7000 }: HighlightsCarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const count = events.length;
  const event = events[index];

  const go = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setIndex((i) => (i + dir + count) % count);
    },
    [count]
  );

  const goTo = (i: number) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  };

  // Avance automatique pilotée image par image : la pause (survol, focus) gèle la progression
  // au lieu de la remettre à zéro, et la barre reste synchronisée avec le changement de diapositive.
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = useMotionValue(0);
  const elapsed = useRef(0);

  useEffect(() => {
    elapsed.current = 0;
    progress.set(0);
  }, [index, progress]);

  useAnimationFrame((_, delta) => {
    if (count <= 1 || paused || reduced) return;
    elapsed.current += delta;
    progress.set(Math.min(elapsed.current / intervalMs, 1));
    if (elapsed.current >= intervalMs) go(1);
  });

  if (!event) return null;

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carrousel"
      aria-label="Prochains temps forts"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}>

      <div className="grid overflow-hidden rounded-3xl bg-fecam-sand lg:grid-cols-[1.05fr_1fr]">
        {/* Image : fondu + léger dézoom, glissable au doigt */}
        <div className="relative min-h-[300px] overflow-hidden bg-fecam-black lg:min-h-[540px]">
          <AnimatePresence initial={false}>
            <motion.img
              key={event.id}
              src={event.image}
              alt=""
              className="absolute inset-0 h-full w-full cursor-grab object-cover active:cursor-grabbing"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 0.8 }, scale: { duration: 1.6, ease: easeOut } }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(1);else
                if (info.offset.x > 60) go(-1);
              }} />

          </AnimatePresence>
          <span className="absolute left-5 top-5 rounded-full bg-fecam-paper/90 px-3 py-1 text-xs font-semibold backdrop-blur" aria-live="polite">
            {index + 1} / {count}
          </span>
        </div>

        {/* Texte : glisse dans le sens de la navigation */}
        <div className="relative flex flex-col justify-center overflow-hidden p-8 lg:p-14">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={event.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.55, ease: easeOut }}>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fecam-clay">Prochain temps fort · {event.category}</p>
              <p className="mt-6 flex items-end gap-3 font-poster uppercase leading-[0.85]">
                <span className="text-[6.5rem] lg:text-[8.5rem]">{formatDay(event.date)}</span>
                <span className="pb-2 text-3xl text-fecam-black/65 lg:pb-3 lg:text-4xl">
                  {event.endDate && <>– {formatDay(event.endDate)} </>}
                  {formatMonthShort(event.date)}
                </span>
              </p>
              <h2 className="mt-6 max-w-md font-display text-3xl font-bold leading-tight lg:text-4xl">{event.title}</h2>
              <p className="mt-3 max-w-md text-fecam-black/65">{event.summary}</p>
              <p className="mt-4 flex items-center gap-2 text-sm font-medium text-fecam-black/70">
                <MapPinIcon className="h-4 w-4" /> {event.venue}, {event.city}
              </p>
              <Link to={`/evenements/${event.id}`} className="link-draw mt-8">
                Voir l’événement <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </motion.div>
          </AnimatePresence>

          {count > 1 &&
          <div className="mt-12 flex items-center gap-6">
              {/* Segments de progression : le segment actif se remplit pendant l'intervalle */}
              <div className="flex flex-1 gap-2">
                {events.map((e, i) =>
              <button
                key={e.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Afficher : ${e.title}`}
                aria-current={i === index}
                className="group relative h-6 flex-1">

                    <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-fecam-black/15 transition-colors group-hover:bg-fecam-black/30">
                      {i === index ?
                  <motion.span className="absolute inset-0 origin-left bg-fecam-black" style={{ scaleX: reduced ? 1 : progress }} /> :

                  <span className={`absolute inset-0 bg-fecam-black ${i < index ? '' : 'hidden'}`} />
                  }

                    </span>
                  </button>
              )}
              </div>
              <div className="flex gap-2">
                <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Temps fort précédent"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-fecam-black/15 transition-colors duration-300 hover:border-fecam-black hover:bg-fecam-black hover:text-fecam-paper">

                  <ArrowLeftIcon className="h-4 w-4" />
                </button>
                <button
                type="button"
                onClick={() => go(1)}
                aria-label="Temps fort suivant"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-fecam-black/15 transition-colors duration-300 hover:border-fecam-black hover:bg-fecam-black hover:text-fecam-paper">

                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

}
