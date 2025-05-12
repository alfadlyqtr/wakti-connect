
import React from 'react';
import SimpleInvitationsList from '@/components/invitations/SimpleInvitationsList';
import SimpleInvitationCreator from '@/components/invitations/SimpleInvitationCreator';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSimpleInvitationById } from '@/services/invitation/simple-invitations';
import DashboardBusinessReports from '@/pages/dashboard/DashboardBusinessReports';
import DashboardAnalyticsHub from '@/pages/dashboard/DashboardAnalyticsHub';

// Import the proper events components
import EventCreationForm from '@/components/events/creation/EventCreationForm';
import ViewEventPage from '@/components/events/ViewEventPage';
import EventsListPage from '@/components/events/EventsListPage';

const InvitationEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { data: invitation, isLoading, error } = useQuery({
    queryKey: ['invitation', id],
    queryFn: () => id ? getSimpleInvitationById(id) : Promise.resolve(null),
    enabled: !!id
  });

  if (isLoading) {
    return <div className="p-8 text-center">Loading invitation...</div>;
  }

  if (error || !invitation) {
    return <div className="p-8 text-center">Could not load invitation. It may have been deleted.</div>;
  }

  return <SimpleInvitationCreator existingInvitation={invitation} />;
};

// Component for viewing a single event
const EventView = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div className="p-8 text-center">Event ID is required</div>;
  }
  
  return <ViewEventPage eventId={id} />;
};

// Component for editing an event
const EventEdit = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div className="p-8 text-center">Event ID is required</div>;
  }
  
  return <EventCreationForm eventId={id} />;
};

export const dashboardRoutes = [
  // Invitations routes
  {
    path: "invitations",
    element: <SimpleInvitationsList />,
  },
  {
    path: "invitations/new",
    element: <SimpleInvitationCreator />,
  },
  {
    path: "invitations/edit/:id",
    element: <InvitationEdit />,
  },
  
  // Events routes - with proper components
  {
    path: "events",
    element: <EventsListPage />,
  },
  {
    path: "events/create",
    element: <EventCreationForm />,
  },
  {
    path: "events/new",
    element: <EventCreationForm />,
  },
  {
    path: "events/view/:id",
    element: <EventView />,
  },
  {
    path: "events/edit/:id",
    element: <EventEdit />,
  },
  
  // Analytics and reports routes
  {
    path: "analytics",
    element: <DashboardAnalyticsHub />,
  },
  {
    path: "reports",
    element: <DashboardBusinessReports />,
  },
];

export default dashboardRoutes;
