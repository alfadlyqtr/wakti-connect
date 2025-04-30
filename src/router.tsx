
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import CreateInvitationPage from './pages/invitations/CreateInvitationPage';
import InvitationsListPage from './pages/invitations/InvitationsListPage';
import SharedInvitationPage from './pages/invitations/SharedInvitationPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Placeholder component for missing dashboard components
const PlaceholderComponent = () => <div>Page coming soon</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: "dashboard",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/tasks",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/events",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/events/:eventId",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/events/:eventId/edit",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/bookings",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/jobs",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/services",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/staff",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/business-page",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/analytics",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/reports",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/settings",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/help",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/ai-assistant",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/meeting-summary",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/notifications",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/messages",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/contacts",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/staff-dashboard",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      {
        path: "dashboard/work-management",
        element: <ProtectedRoute><PlaceholderComponent /></ProtectedRoute>,
      },
      
      // Add new invitation routes
      {
        path: "invitations",
        element: <ProtectedRoute><InvitationsListPage /></ProtectedRoute>,
      },
      {
        path: "invitations/new",
        element: <ProtectedRoute><CreateInvitationPage /></ProtectedRoute>,
      },
    ],
  },
  // Public shared invitation route - outside of main layout
  {
    path: "/i/:shareId",
    element: <SharedInvitationPage />,
  }
]);
