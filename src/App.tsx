import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { AdminLayout } from './admin/AdminLayout';
import { ArtistsAdmin } from './admin/ArtistsAdmin';
import { Dashboard } from './admin/Dashboard';
import { EventsAdmin } from './admin/EventsAdmin';
import { inboxes, InboxPage } from './admin/InboxPage';
import { Login } from './admin/Login';
import { NewsAdmin } from './admin/NewsAdmin';
import { RadioAdmin } from './admin/RadioAdmin';
import { ReleasesAdmin } from './admin/ReleasesAdmin';
import { SettingsAdmin } from './admin/SettingsAdmin';
import { Layout } from './components/Layout';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { RadioProvider } from './contexts/RadioContext';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { EventDetail } from './pages/EventDetail';
import { Events } from './pages/Events';
import { Home } from './pages/Home';
import { Membership } from './pages/Membership';
import { News } from './pages/News';
import { NotFound } from './pages/NotFound';
import { Radio } from './pages/Radio';

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AdminAuthProvider>
        <RadioProvider>
          <BrowserRouter>
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
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="evenements" element={<EventsAdmin />} />
                <Route path="actualites" element={<NewsAdmin />} />
                <Route path="artistes" element={<ArtistsAdmin />} />
                <Route path="radio" element={<RadioAdmin />} />
                <Route path="sorties" element={<ReleasesAdmin />} />
                {Object.entries(inboxes).map(([path, config]) =>
                <Route key={path} path={path} element={<InboxPage key={path} {...config} />} />
                )}
                <Route path="reglages" element={<SettingsAdmin />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </RadioProvider>
      </AdminAuthProvider>
    </MotionConfig>);

}
