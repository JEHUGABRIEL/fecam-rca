import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRadio } from '../contexts/RadioContext';
import { images } from '../data/site';
import { useRadioShows } from '../hooks/data';
import { useNow } from '../hooks/useNow';
import { formatShowTime, getCurrentShow, getNextShow } from '../utils/radio';
import { Equalizer } from './Equalizer';
import { RadioPlayButton } from './RadioPlayButton';
import { easeOut, MaskedLines } from './Reveal';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: easeOut }
});

// Hero « affiche » avec la radio en direct au premier plan.
export function HomeHero() {
  const { status } = useRadio();
  const now = useNow();
  const { data: radioShows } = useRadioShows();
  const current = getCurrentShow(radioShows, now);
  const next = getNextShow(radioShows, now);
  const isPlaying = status === 'playing';

  return (
    <section className="grain overflow-hidden bg-fecam-black text-fecam-paper">
      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-5 pb-24 pt-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="flex flex-col justify-center">
          <motion.p {...fadeUp(0)} className="font-serif text-xl italic text-fecam-orange">
            Bangui, depuis 2014
          </motion.p>
          <h1 className="mt-5 font-poster text-[clamp(3rem,7vw,6.5rem)] uppercase leading-[0.95]">
            <MaskedLines
              delay={0.1}
              lines={['La maison', 'de la musique', <span key="c" className="text-fecam-orange">centrafricaine</span>]} />

          </h1>
          <motion.p {...fadeUp(0.55)} className="mt-8 max-w-md text-lg leading-relaxed text-fecam-paper/70">
            Concerts, formations, défense des droits et une radio 100&nbsp;% musique d’ici&nbsp;: la fédération qui fait vivre la scène du pays.
          </motion.p>
          <motion.div {...fadeUp(0.65)} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link to="/evenements" className="btn-primary hover:!bg-fecam-paper hover:!text-fecam-black">
              Voir l’agenda <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link to="/adhesion" className="link-draw text-fecam-paper">
              Devenir membre <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:mt-4">
          {/* La photo se dévoile de bas en haut en se dézoomant */}
          <motion.div
            className="overflow-hidden rounded-2xl"
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            transition={{ duration: 1.3, delay: 0.2, ease: easeOut }}>

            <motion.img
              src={images.hero}
              alt="Concert d’un groupe sur une scène de Bangui"
              className="aspect-[4/5] w-full object-cover"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.8, delay: 0.2, ease: easeOut }} />

          </motion.div>

          {/* Carte « à l'antenne » */}
          <motion.div
            {...fadeUp(0.9)}
            className="relative -mt-16 ml-6 rounded-2xl bg-fecam-paper p-5 text-fecam-black shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] sm:-ml-8 lg:-ml-14">

            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-fecam-black/60">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fecam-orange opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-fecam-orange" />
                </span>
                Radio FECAM · en direct
              </p>
              <Equalizer active={isPlaying} className="h-4 text-fecam-orange" />
            </div>
            <div className="mt-4 flex items-center gap-4">
              <RadioPlayButton size="lg" />
              <div className="min-w-0">
                <p className="truncate font-display text-xl font-bold leading-tight">{current?.title ?? 'Programmation musicale'}</p>
                {current &&
                <p className="truncate text-sm text-fecam-black/60">
                    {current.host} · jusqu’à {formatShowTime(current.end)}
                  </p>
                }
              </div>
            </div>
            {next &&
            <p className="mt-4 border-t border-fecam-black/10 pt-3 text-sm text-fecam-black/60">
                Ensuite à {formatShowTime(next.start)} · <span className="font-medium text-fecam-black">{next.title}</span>
              </p>
            }
          </motion.div>
        </div>
      </div>
    </section>);

}
