import { motion } from 'framer-motion';
import { Logo } from './Logo';

const bars = [0.55, 0.9, 0.4, 1, 0.65, 0.8, 0.45];

// Écran de chargement plein écran (premier affichage, chargement d'une section du site).
// Même rendu que l'écran statique d'index.html, pour un passage sans saut.
export function LoadingScreen({ label = 'Chargement' }: {label?: string;}) {
  return (
    <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-fecam-black text-fecam-paper" role="status" aria-live="polite">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <Logo tone="dark" className="text-lg" />
      </motion.div>
      <div className="mt-10 flex h-8 items-end gap-1.5" aria-hidden="true">
        {bars.map((h, i) =>
        <span
          key={i}
          className="w-1.5 origin-bottom rounded-full bg-fecam-orange animate-equalizer motion-reduce:animate-none"
          style={{ height: `${h * 100}%`, animationDelay: `${i * 0.11}s` }} />

        )}
      </div>
      <span className="sr-only">{label}…</span>
    </div>);

}

// Chargement d'une page à l'intérieur du site (l'en-tête reste affiché)
export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <div className="flex h-6 items-end gap-1" aria-hidden="true">
        {bars.slice(0, 5).map((h, i) =>
        <span key={i} className="w-1 origin-bottom rounded-full bg-fecam-orange animate-equalizer motion-reduce:animate-none" style={{ height: `${h * 100}%`, animationDelay: `${i * 0.11}s` }} />
        )}
      </div>
      <span className="sr-only">Chargement…</span>
    </div>);

}
