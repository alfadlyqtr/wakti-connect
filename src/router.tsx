import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import CreateInvitationPage from './pages/invitations/CreateInvitationPage';
import InvitationsListPage from './pages/invitations/InvitationsListPage';
import SharedInvitationPage from './pages/invitations/SharedInvitationPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/dashboard/Dashboard';
import DashboardTasks from './pages/dashboard/DashboardTasks';
import DashboardEvents from './pages/dashboard/DashboardEvents';
import DashboardBookings from './pages/dashboard/DashboardBookings';
import DashboardJobs from './pages/dashboard/DashboardJobs';
import DashboardServices from './pages/dashboard/DashboardServices';
import DashboardStaff from './pages/dashboard/DashboardStaff';
import DashboardBusinessPage from './pages/dashboard/DashboardBusinessPage';
import DashboardAnalytics from './pages/dashboard/DashboardAnalytics';
import DashboardReports from './pages/dashboard/DashboardReports';
import DashboardSettings from './pages/dashboard/DashboardSettings';
import DashboardHelp from './pages/dashboard/DashboardHelp';
import AiAssistant from './pages/dashboard/AiAssistant';
import MeetingSummary from './pages/dashboard/MeetingSummary';
import NotificationsPage from './pages/dashboard/NotificationsPage';
import MessagesPage from './pages/dashboard/MessagesPage';
import ContactsPage from './pages/dashboard/ContactsPage';
import StaffDashboard from './pages/dashboard/StaffDashboard';
import DashboardWorkManagement from './pages/dashboard/DashboardWorkManagement';
import EventDetailPage from './pages/events/EventDetailPage';
import EditEventPage from './pages/events/EditEventPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: "dashboard",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: "dashboard/tasks",
        element: <ProtectedRoute><DashboardTasks /></ProtectedRoute>,
      },
      {
        path: "dashboard/events",
        element: <ProtectedRoute><DashboardEvents /></ProtectedRoute>,
      },
      {
        path: "dashboard/events/:eventId",
        element: <ProtectedRoute><EventDetailPage /></ProtectedRoute>,
      },
      {
        path: "dashboard/events/:eventId/edit",
        element: <ProtectedRoute><EditEventPage /></ProtectedRoute>,
      },
      {
        path: "dashboard/bookings",
        element: <ProtectedRoute><DashboardBookings /></ProtectedRoute>,
      },
      {
        path: "dashboard/jobs",
        element: <ProtectedRoute><DashboardJobs /></ProtectedRoute>,
      },
      {
        path: "dashboard/services",
        element: <ProtectedRoute><DashboardServices /></ProtectedRoute>,
      },
      {
        path: "dashboard/staff",
        element: <ProtectedRoute><DashboardStaff /></ProtectedRoute>,
      },
      {
        path: "dashboard/business-page",
        element: <ProtectedRoute><DashboardBusinessPage /></ProtectedRoute>,
      },
      {
        path: "dashboard/analytics",
        element: <ProtectedRoute><DashboardAnalytics /></ProtectedRoute>,
      },
      {
        path: "dashboard/reports",
        element: <ProtectedRoute><DashboardReports /></ProtectedRoute>,
      },
      {
        path: "dashboard/settings",
        element: <ProtectedRoute><DashboardSettings /></ProtectedRoute>,
      },
      {
        path: "dashboard/help",
        element: <ProtectedRoute><DashboardHelp /></ProtectedRoute>,
      },
      {
        path: "dashboard/ai-assistant",
        element: <ProtectedRoute><AiAssistant /></ProtectedRoute>,
      },
      {
        path: "dashboard/meeting-summary",
        element: <ProtectedRoute><MeetingSummary /></ProtectedRoute>,
      },
      {
        path: "dashboard/notifications",
        element: <ProtectedRoute><NotificationsPage /></ProtectedRoute>,
      },
      {
        path: "dashboard/messages",
        element: <ProtectedRoute><MessagesPage /></ProtectedRoute>,
      },
      {
        path: "dashboard/contacts",
        element: <ProtectedRoute><ContactsPage /></ProtectedRoute>,
      },
      {
        path: "dashboard/staff-dashboard",
        element: <ProtectedRoute><StaffDashboard /></ProtectedRoute>,
      },
      {
        path: "dashboard/work-management",
        element: <ProtectedRoute><DashboardWorkManagement /></ProtectedRoute>,
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
