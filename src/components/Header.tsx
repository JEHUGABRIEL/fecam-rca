import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { MenuIcon, XIcon } from 'lucide-react';
import { useRadio } from '../contexts/RadioContext';
import { navItems, secondaryNavItems } from '../data/navigation';
import { Equalizer } from './Equalizer';
import { Logo } from './Logo';

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { status, toggle } = useRadio();
  const isPlaying = status === 'playing';
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  // Au-delà du hero, l'en-tête se resserre et devient translucide
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-500 ${
      scrolled ? 'border-fecam-black/10 bg-fecam-paper/85 shadow-[0_8px_30px_-12px_rgba(26,22,18,0.18)] backdrop-blur-md' : 'border-transparent bg-fecam-paper'}`
      }>
      <div className={`mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 transition-[height] duration-500 ease-out lg:px-8 ${scrolled ? 'h-16' : 'h-20'}`}>
        <Link to="/" aria-label="FECAM — accueil" className="shrink-0">
          <Logo className="text-[15px] md:text-base" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-9 lg:flex">
          {navItems.map((item) =>
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
            `relative inline-flex items-center whitespace-nowrap py-2 text-[15px] font-medium transition-colors duration-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-current after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isActive ?
            'text-fecam-black after:scale-x-100' :
            'text-fecam-black/60 after:scale-x-0 hover:text-fecam-black hover:after:scale-x-100'}`

            }>
            
              {item.label}
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={isPlaying ? 'Mettre Radio FECAM en pause' : 'Écouter Radio FECAM en direct'}
            className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-fecam-black/15 px-4 py-2 text-sm font-semibold text-fecam-black transition-colors duration-300 hover:border-fecam-black">
            
            <Equalizer active={isPlaying} className="h-3.5 text-fecam-orange" />
            <span className="hidden sm:inline">{isPlaying ? 'En écoute' : 'Écouter le direct'}</span>
          </button>
          <Link
            to="/adhesion"
            className="btn-dark hidden !px-5 !py-2.5 sm:inline-flex">
            
            Devenir membre
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="p-2.5 text-fecam-black transition-colors duration-150 hover:bg-fecam-black/5 lg:hidden">
            
            {open ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open &&
        <motion.nav
          id="menu-mobile"
          aria-label="Navigation mobile"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-x-0 top-full border-b border-fecam-black/10 bg-fecam-paper lg:hidden">
          
            <ul className="mx-auto max-w-7xl px-5 py-4">
              {[{ to: '/', label: 'Accueil' }, ...navItems, ...secondaryNavItems.filter((i) => i.to !== '/adhesion')].map((item) =>
            <li key={item.to}>
                  <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                `block border-b border-fecam-black/10 py-3 font-display text-2xl font-bold ${
                isActive ? 'text-fecam-orange' : 'text-fecam-black'}`

                }>
                
                    {item.label}
                  </NavLink>
                </li>
            )}
              <li className="pt-4">
                <Link to="/adhesion" className="btn-dark w-full">
                  Devenir membre
                </Link>
              </li>
            </ul>
          </motion.nav>
        }
      </AnimatePresence>
    </header>);

}