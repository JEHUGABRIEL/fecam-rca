import { useState } from 'react';
import { presidentMessage } from '../data/federation';
import { Reveal } from './Reveal';

export function PresidentMessage() {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = presidentMessage.name.
  split(' ').
  filter((w) => w.length > 2).
  slice(-2).
  map((w) => w[0]).
  join('');

  return (
    <section className="bg-fecam-sand text-fecam-black">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 lg:px-8 lg:py-28">
        <Reveal className="relative mx-auto w-full max-w-xs overflow-hidden rounded-2xl lg:mx-0">
          {!imageFailed ?
          <img
            src={presidentMessage.image}
            alt={presidentMessage.name}
            onError={() => setImageFailed(true)}
            className="aspect-[4/5] w-full object-cover" /> :


          <div className="flex aspect-[4/5] w-full items-center justify-center bg-fecam-black/10" aria-hidden="true">
              <span className="font-display text-6xl font-bold text-fecam-black">{initials}</span>
            </div>
          }
        </Reveal>
        <Reveal delay={0.15}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-fecam-clay">Le mot du Président</h2>
          <blockquote className="mt-4">
            <span className="block h-16 font-serif text-[8rem] leading-[1] text-fecam-orange" aria-hidden="true">“</span>
            <p className="max-w-3xl font-serif text-2xl italic leading-snug lg:text-[2rem] lg:leading-[1.35]">{presidentMessage.message}</p>
          </blockquote>
          <p className="mt-10 font-display text-xl font-bold">{presidentMessage.name}</p>
          <p className="text-sm font-medium text-fecam-black/60">{presidentMessage.role}</p>
        </Reveal>
      </div>
    </section>);

}
