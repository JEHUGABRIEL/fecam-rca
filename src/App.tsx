import { ComponentType, lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Layout } from './components/Layout';
import { LoadingScreen } from './components/LoadingScreen';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { RadioProvider } from './contexts/RadioContext';

// Chaque page est un fichier JS séparé, chargé à la première visite (écran de chargement entre-temps)
const page = <K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) =>
lazy(() => load().then((m) => ({ default: m[name] })));

const Home = page(() => import('./pages/Home'), 'Home');
const Events = page(() => import('./pages/Events'), 'Events');
const EventDetail = page(() => import('./pages/EventDetail'), 'EventDetail');
const Radio = page(() => import('./pages/Radio'), 'Radio');
const News = page(() => import('./pages/News'), 'News');
const Membership = page(() => import('./pages/Membership'), 'Membership');
const About = page(() => import('./pages/About'), 'About');
const Contact = page(() => import('./pages/Contact'), 'Contact');
const NotFound = page(() => import('./pages/NotFound'), 'NotFound');

// Back-office : chargé seulement quand on visite /admin
const AdminLayout = page(() => import('./admin/AdminLayout'), 'AdminLayout');
const Login = page(() => import('./admin/Login'), 'Login');
const adminMenu = () => import('./admin/menu');
const AdminRoutes = lazy(() =>
adminMenu().then(({ menu, Dashboard }) => ({
  default: () =>
  <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          {menu.map((group) =>
      <Route key={group.base} path={group.base}>
              <Route index element={<Navigate to={group.items[0].path} replace />} />
              {group.items.map((item) =>
        <Route key={item.path} path={item.path} element={<item.element />} />
        )}
            </Route>
      )}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>

}))
);

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AdminAuthProvider>
        <RadioProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/evenements" element={<Events />} />
                  <Route path="/evenements/:id" element={<EventDetail />} />
                  <Route path="/radio" element={<Radio />} />
                  {/* L'annuaire public a été retiré : les artistes à la une sont sur l'accueil */}
                  <Route path="/artistes" element={<Navigate to="/" replace />} />
                  <Route path="/actualites" element={<News />} />
                  <Route path="/adhesion" element={<Membership />} />
                  <Route path="/a-propos" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                <Route path="/admin/connexion" element={<Login />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </RadioProvider>
      </AdminAuthProvider>
    </MotionConfig>);

}
