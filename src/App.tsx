
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { useAuth } from './lib/auth';
import Auth from './pages/Auth';
import DashboardEvents from './pages/dashboard/DashboardEvents';
import SimpleInvitationCreator from './pages/invitations/SimpleInvitationCreator';

const App = () => {
  const { isAuthenticated } = useAuth?.() || { isAuthenticated: false };

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard/events" /> : <Auth />} />
        <Route path="/dashboard" element={isAuthenticated ? <DashboardEvents /> : <Navigate to="/auth" />} />
        <Route path="/dashboard/events" element={isAuthenticated ? <DashboardEvents /> : <Navigate to="/auth" />} />
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard/events" /> : <Navigate to="/auth" />} />
        <Route path="/invitations/create" element={<SimpleInvitationCreator />} />
        <Route path="/dashboard/invitations/create" element={<SimpleInvitationCreator />} />
      </Routes>
    </Router>
  );
};

export default App;
