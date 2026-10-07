import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Volume2Icon, VolumeXIcon, XIcon } from 'lucide-react';
import { useRadio } from '../contexts/RadioContext';
import { useRadioShows } from '../hooks/data';
import { useNow } from '../hooks/useNow';
import { getCurrentShow } from '../utils/radio';
import { Equalizer } from './Equalizer';
import { easeOut } from './Reveal';
import { RadioPlayButton } from './RadioPlayButton';

export function RadioBar() {
  const { status, volume, muted, setVolume, toggleMute, barVisible, hideBar } = useRadio();
  const { data: radioShows } = useRadioShows();
  const now = useNow();
  const current = getCurrentShow(radioShows, now);

  const line =
  status === 'error' ?
  'Flux momentanément indisponible — réessayez dans un instant.' :
  current ?
  `${current.title} · ${current.host}` :
  'Programmation musicale';

  return (
    <AnimatePresence>
      {barVisible &&
    <motion.section
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.6, ease: easeOut }}
      aria-label="Lecteur Radio FECAM" className="fixed inset-x-0 bottom-0 z-50 border-t border-fecam-paper/10 bg-fecam-black/95 backdrop-blur-md text-fecam-paper">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-5 lg:px-8">
        <RadioPlayButton tone="orange" />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-fecam-orange">
            <Equalizer active={status === 'playing'} className="h-3" />
            Radio FECAM · En direct
          </p>
          <p className="truncate text-sm font-medium text-fecam-paper/85" aria-live="polite">
            {line}
          </p>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? 'Réactiver le son' : 'Couper le son'}
            className="p-2 text-fecam-paper transition-colors duration-150 hover:text-fecam-orange">
            
            {muted || volume === 0 ? <VolumeXIcon className="h-5 w-5" /> : <Volume2Icon className="h-5 w-5" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
            className="w-28" />
          
        </div>
        <Link
          to="/radio"
          className="hidden whitespace-nowrap rounded-full border border-fecam-paper/25 px-4 py-1.5 text-xs font-semibold transition-colors duration-300 hover:border-fecam-paper sm:inline-flex">
          
          Programme
        </Link>
        <button
          type="button"
          onClick={hideBar}
          aria-label="Fermer le lecteur radio"
          className="p-2 text-fecam-paper/70 transition-colors duration-150 hover:text-fecam-orange">
          
          <XIcon className="h-5 w-5" />
        </button>
      </div>
    </motion.section>
      }
    </AnimatePresence>);

}