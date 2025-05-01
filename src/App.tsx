import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { useAuth } from './lib/auth';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import BusinessPage from './pages/business/BusinessPage';
import BusinessDashboard from './pages/business/BusinessDashboard';
import EventForm from './components/events/EventForm';
import EventDetailsPage from './pages/events/EventDetailsPage';
import PublicBusinessPage from './pages/business/PublicBusinessPage';
import PublicEventPage from './pages/events/PublicEventPage';
import InvitationPage from './pages/invitations/InvitationPage';
import DashboardEvents from './pages/dashboard/DashboardEvents';
import SimpleInvitationCreator from './pages/invitations/SimpleInvitationCreator';

const App = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/auth" />} />
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />} />
        <Route path="/business/:businessId/page" element={<BusinessPage />} />
        <Route path="/business/:businessId/dashboard" element={<BusinessDashboard />} />
        <Route path="/events/create" element={<EventForm />} />
        <Route path="/events/:eventId/edit" element={<EventForm />} />
        <Route path="/events/:eventId" element={<EventDetailsPage />} />
        <Route path="/page/:businessSlug" element={<PublicBusinessPage />} />
        <Route path="/event/:shareId" element={<PublicEventPage />} />
        <Route path="/invitation/:shareId" element={<InvitationPage />} />
        <Route path="/dashboard/events" element={<DashboardEvents />} />
        <Route path="/invitations/create" element={<SimpleInvitationCreator />} />
      </Routes>
    </Router>
  );
};

export default App;
