import { useEffect, useState } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ExternalLinkIcon, LogOutIcon, MenuIcon, XIcon } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const groups = [
{ title: null, links: [{ to: '/admin', label: 'Tableau de bord', end: true }] },
{
  title: 'Contenu',
  links: [
  { to: '/admin/evenements', label: 'Événements' },
  { to: '/admin/actualites', label: 'Actualités' },
  { to: '/admin/sorties', label: 'Dernières sorties' },
  { to: '/admin/artistes', label: 'Artistes' },
  { to: '/admin/radio', label: 'Grille radio' }]

},
{
  title: 'Envois du public',
  links: [
  { to: '/admin/adhesions', label: 'Adhésions' },
  { to: '/admin/messages', label: 'Messages' },
  { to: '/admin/reservations', label: 'Réservations' },
  { to: '/admin/dedicaces', label: 'Dédicaces' },
  { to: '/admin/newsletter', label: 'Newsletter' }]

},
{ title: 'Site', links: [{ to: '/admin/reglages', label: 'Réglages' }] }];


export function AdminLayout() {
  const { authenticated, loading, signOut } = useAdminAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setMenuOpen(false), [pathname]);

  if (loading) return null;
  if (!authenticated) return <Navigate to="/admin/connexion" replace />;

  const nav =
  <nav className="space-y-6">
      {groups.map((g) =>
    <div key={g.title ?? 'main'}>
          {g.title && <p className="mb-2 px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-fecam-black/40">{g.title}</p>}
          <div className="space-y-0.5">
            {g.links.map((l) =>
        <NavLink
          key={l.to}
          to={l.to}
          end={'end' in l ? l.end : false}
          className={({ isActive }) =>
          `block rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200 ${
          isActive ? 'bg-fecam-black text-fecam-paper' : 'text-fecam-black/70 hover:bg-fecam-black/5 hover:text-fecam-black'}`
          }>

                {l.label}
              </NavLink>
        )}
          </div>
        </div>
    )}
      <div className="space-y-0.5 border-t border-fecam-black/10 pt-4">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-fecam-black/70 hover:bg-fecam-black/5">
          <ExternalLinkIcon className="h-4 w-4" /> Voir le site
        </a>
        <button type="button" onClick={signOut} className="flex w-full items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-fecam-black/70 hover:bg-fecam-black/5">
          <LogOutIcon className="h-4 w-4" /> Se déconnecter
        </button>
      </div>
    </nav>;


  return (
    <div className="min-h-screen bg-fecam-paper text-fecam-black lg:flex">
      {/* Barre mobile */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-fecam-black/10 bg-fecam-paper/90 px-5 py-3 backdrop-blur lg:hidden">
        <Logo className="text-sm" compact />
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="rounded-full p-2 hover:bg-fecam-black/5">

          {menuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </header>
      {menuOpen && <div className="border-b border-fecam-black/10 bg-fecam-paper px-3 py-4 lg:hidden">{nav}</div>}

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-fecam-black/10 bg-white/60 px-3 py-6 lg:block">
        <div className="mb-8 px-4">
          <Logo className="text-sm" compact />
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-fecam-black/40">Back-office</p>
        </div>
        {nav}
      </aside>
      <main className="min-w-0 flex-1 p-5 lg:p-10">
        <Outlet />
      </main>
    </div>);

}
