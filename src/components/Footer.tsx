import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, Loader2Icon } from 'lucide-react';
import { useSubmit } from '../hooks/useSubmit';
import { navItems, secondaryNavItems } from '../data/navigation';
import { site } from '../data/site';
import { Honeypot } from './Honeypot';
import { Logo } from './Logo';
import { SocialLinks } from './SocialLinks';

export function Footer() {
  const [email, setEmail] = useState('');
  const { state, message, submit } = useSubmit('newsletter_subscribers');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!email) return;
    submit(e, { email });
  };

  return (
    <footer className="grain bg-fecam-black text-fecam-paper">
      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1.4fr] lg:px-8">
        <div>
          <Logo tone="dark" className="text-lg" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-fecam-paper/75">
            La Fédération Centrafricaine de Musique rassemble artistes, groupes et structures pour faire vivre la musique du pays.
          </p>
          <SocialLinks className="mt-6" />
        </div>

        <nav aria-label="Liens du pied de page">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-fecam-paper/45">Le site</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[...navItems, ...secondaryNavItems].map((item) =>
            <li key={item.to}>
                <Link to={item.to} className="text-fecam-paper/75 transition-colors duration-300 hover:text-fecam-paper">
                  {item.label}
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-fecam-paper/45">Contact</h2>
          <address className="mt-4 space-y-2.5 text-sm not-italic text-fecam-paper/75">
            <p>{site.address}</p>
            <p>
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="hover:text-fecam-paper">{site.phone}</a>
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="hover:text-fecam-paper">{site.email}</a>
            </p>
          </address>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-fecam-paper/45">Lettre d’information</h2>
          <p className="mt-4 text-sm text-fecam-paper/75">Agenda, appels à candidatures et nouveautés de la radio, une fois par mois.</p>
          {state === 'success' ?
          <p className="mt-4 flex items-center gap-2 text-sm font-semibold" role="status">
              <CheckIcon className="h-4 w-4 text-fecam-orange" /> Merci, votre inscription est enregistrée.
            </p> :

          <form onSubmit={handleSubmit} className="relative mt-4 flex gap-2">
              <Honeypot />
              <label htmlFor="newsletter" className="sr-only">Adresse e-mail</label>
              <input
              id="newsletter"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="min-w-0 flex-1 rounded-full border border-fecam-paper/20 bg-transparent px-4 py-2.5 text-sm text-fecam-paper placeholder:text-fecam-paper/40 transition-colors duration-300 focus:border-fecam-paper/60 focus:outline-none" />
            
              <button type="submit" disabled={state === 'submitting'} className="btn-primary !px-5 !py-2.5 hover:!bg-fecam-paper hover:!text-fecam-black disabled:opacity-70">
                {state === 'submitting' ? <Loader2Icon className="h-4 w-4 animate-spin" /> : 'S’inscrire'}
              </button>
            </form>
          }
          {state === 'error' && <p className="mt-2 text-sm text-fecam-orange" role="alert">{message}</p>}
        </div>
      </div>
      <div className="relative z-10 border-t border-fecam-paper/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-fecam-paper/60 sm:flex-row sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} {site.fullName}. Tous droits réservés.</p>
          <a href="/admin" className="transition-colors duration-300 hover:text-fecam-paper">Espace administration</a>
        </div>
      </div>
    </footer>);

}