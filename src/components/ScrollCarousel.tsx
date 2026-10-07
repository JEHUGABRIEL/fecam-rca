import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

interface ScrollCarouselProps {
  children: React.ReactNode;
  label: string;
  // Index de la carte à afficher en premier (ex. l'émission en cours)
  startIndex?: number;
  // Défilement automatique (ms), suspendu au survol, au focus et au toucher
  autoplayMs?: number;
  tone?: 'light' | 'dark';
  className?: string;
}

// Rangée de cartes défilante : flèches, glisser au doigt, barre de progression, lecture automatique.
// Chaque enfant direct est une carte (snap-start).
export function ScrollCarousel({ children, label, startIndex = 0, autoplayMs, tone = 'light', className = '' }: ScrollCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [paused, setPaused] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  // Pas de défilement = largeur d'une carte + l'espacement
  const step = () => {
    const el = trackRef.current;
    const card = el?.children[0] as HTMLElement | undefined;
    if (!el || !card) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return card.offsetWidth + gap;
  };

  const scrollBy = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    // Arrivé au bout, la lecture automatique repart du début
    if (dir === 1 && el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior: 'smooth' });else
    el.scrollBy({ left: dir * step(), behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = startIndex * step();
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startIndex]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!autoplayMs || paused || reduced) return;
    const id = window.setInterval(() => scrollBy(1), autoplayMs);
    return () => window.clearInterval(id);
  }, [autoplayMs, paused, scrollBy]);

  const arrow =
  tone === 'light' ?
  'border-fecam-black/15 text-fecam-black hover:border-fecam-black hover:bg-fecam-black hover:text-fecam-paper' :
  'border-fecam-paper/25 text-fecam-paper hover:border-fecam-paper hover:bg-fecam-paper hover:text-fecam-black';

  return (
    <div
      className={className}
      role="region"
      aria-roledescription="carrousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}>

      <div
        ref={trackRef}
        onScroll={update}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:scroll-px-0 lg:px-0 [&::-webkit-scrollbar]:hidden">

        {children}
      </div>

      <div className="mt-8 flex items-center gap-6">
        <div className={`relative h-px flex-1 ${tone === 'light' ? 'bg-fecam-black/10' : 'bg-fecam-paper/15'}`} aria-hidden="true">
          <div
            className={`absolute inset-y-0 left-0 transition-[width] duration-300 ease-out ${tone === 'light' ? 'bg-fecam-black' : 'bg-fecam-paper'}`}
            style={{ width: `${Math.max(progress, 0.08) * 100}%` }} />

        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!canPrev}
            aria-label="Précédent"
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 disabled:pointer-events-none disabled:opacity-30 ${arrow}`}>

            <ArrowLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={!canNext && !autoplayMs}
            aria-label="Suivant"
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 disabled:pointer-events-none disabled:opacity-30 ${arrow}`}>

            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>);

}
