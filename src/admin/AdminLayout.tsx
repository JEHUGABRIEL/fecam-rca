import { Suspense, useEffect, useState } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon, LogOutIcon, MenuIcon, XIcon } from 'lucide-react';
import { Logo } from '../components/Logo';
import { LoadingScreen, PageLoader } from '../components/LoadingScreen';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { adminPath, dashboardIcon as DashboardIcon, menu, MenuGroup } from './menu';
import { ConfirmProvider, useConfirm } from './ui/ConfirmDialog';

const linkClass = (active: boolean) =>
`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200 ${
active ? 'bg-fecam-black text-fecam-paper' : 'text-fecam-black/70 hover:bg-fecam-black/5 hover:text-fecam-black'}`;

// Rubrique dépliable : s'ouvre seule quand l'une de ses pages est active
function Group({ group }: {group: MenuGroup;}) {
  const { pathname } = useLocation();
  const active = pathname.startsWith(`/admin/${group.base}`);
  const [open, setOpen] = useState(active);
  useEffect(() => {
    if (active) setOpen(true);
  }, [active]);
  const Icon = group.icon;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-fecam-black/5 ${
        active ? 'text-fecam-black' : 'text-fecam-black/70'}`
        }>

        <Icon className="h-4 w-4" />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open &&
        <motion.ul
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="ml-5 overflow-hidden border-l border-fecam-black/10 pl-2">

            {group.items.map((item) =>
          <li key={item.path} className="py-0.5">
                <NavLink
              to={adminPath(group, item)}
              className={({ isActive }) =>
              `block rounded-lg px-3 py-1.5 text-sm transition-colors duration-200 ${
              isActive ? 'bg-fecam-sand font-semibold text-fecam-black' : 'text-fecam-black/60 hover:text-fecam-black'}`
              }>

                  {item.label}
                </NavLink>
              </li>
          )}
          </motion.ul>
        }
      </AnimatePresence>
    </div>);

}

function Shell() {
  const { user, signOut } = useAdminAuth();
  const confirm = useConfirm();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setMenuOpen(false), [pathname]);

  const handleSignOut = async () => {
    const ok = await confirm({
      title: 'Se déconnecter ?',
      message: 'Vous devrez saisir à nouveau votre email et votre mot de passe pour revenir dans le back-office.',
      confirmLabel: 'Se déconnecter',
      tone: 'neutral',
      icon: 'logout'
    });
    if (ok) await signOut();
  };

  const nav =
  <nav aria-label="Back-office" className="flex flex-1 flex-col gap-1">
      <NavLink to="/admin" end className={({ isActive }) => linkClass(isActive)}>
        <DashboardIcon className="h-4 w-4" /> Tableau de bord
      </NavLink>
      {menu.map((g) => <Group key={g.base} group={g} />)}
    </nav>;


  const account =
  <div className="mt-6 flex items-center gap-3 border-t border-fecam-black/10 px-3 pt-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fecam-sand text-sm font-bold uppercase" aria-hidden="true">
        {(user?.name || user?.email || '?').charAt(0)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{user?.name || 'Administrateur'}</p>
        <p className="truncate text-xs text-fecam-black/50">{user?.email}</p>
      </div>
      <button
      type="button"
      onClick={handleSignOut}
      aria-label="Se déconnecter"
      title="Se déconnecter"
      className="rounded-full p-2 text-fecam-black/60 transition-colors hover:bg-fecam-black/5 hover:text-fecam-black">

        <LogOutIcon className="h-4 w-4" />
      </button>
    </div>;


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
      {menuOpen &&
      <div className="border-b border-fecam-black/10 bg-fecam-paper px-3 py-4 lg:hidden">
          {nav}
          {account}
        </div>
      }

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col overflow-y-auto border-r border-fecam-black/10 bg-white/60 px-3 py-6 lg:flex">
        <div className="mb-8 px-3">
          <Logo className="text-sm" compact />
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-fecam-black/40">Back-office</p>
        </div>
        {nav}
        {account}
      </aside>
      <main className="min-w-0 flex-1 p-5 lg:p-10">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>);

}

export function AdminLayout() {
  const { authenticated, loading } = useAdminAuth();
  if (loading) return <LoadingScreen label="Vérification de la session" />;
  if (!authenticated) return <Navigate to="/admin/connexion" replace />;
  return (
    <ConfirmProvider>
      <Shell />
    </ConfirmProvider>);

}
