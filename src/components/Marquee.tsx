interface MarqueeProps {
  items: string[];
}

// Défilé lent des noms de partenaires, séparés par une note.
export function Marquee({ items }: MarqueeProps) {
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-marquee items-center [animation-duration:45s] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[...items, ...items].map((item, i) =>
        <span
          key={`${item}-${i}`}
          aria-hidden={i >= items.length}
          className="flex shrink-0 items-center whitespace-nowrap font-display text-2xl font-semibold text-fecam-black/45 transition-colors duration-300 hover:text-fecam-black lg:text-3xl">
          
            {item}
            <span className="mx-10 text-lg text-fecam-orange" aria-hidden="true">♪</span>
          </span>
        )}
      </div>
    </div>);

}
