import { Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useOutlet } from 'react-router-dom';
import { useRadio } from '../contexts/RadioContext';
import { Footer } from './Footer';
import { Header } from './Header';
import { PageLoader } from './LoadingScreen';
import { RadioBar } from './RadioBar';
import { easeOut } from './Reveal';

export function Layout() {
  const { pathname } = useLocation();
  const outlet = useOutlet();
  const { barVisible } = useRadio();

  return (
    <div className={`flex min-h-screen w-full flex-col bg-fecam-paper text-fecam-black ${barVisible ? 'pb-16' : ''}`}>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-fecam-orange focus:px-4 focus:py-2 focus:font-bold">
        Aller au contenu
      </a>
      <Header />
      {/* Transition de page : la page sortante s'efface, puis on remonte en haut avant l'entrée de la suivante */}
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.main
          key={pathname}
          id="contenu"
          className="flex-1"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } }}
          exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }}>
          
          <Suspense fallback={<PageLoader />}>{outlet}</Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <RadioBar />
    </div>);

}
