
import React from 'react';
import { useParams } from 'react-router-dom';
import EventsListPage from '@/components/events/EventsListPage';
import ViewEventPage from '@/components/events/ViewEventPage';
import EventCreationForm from '@/components/events/creation/EventCreationForm';

const DashboardEvents = () => {
  const { eventId, action } = useParams<{ eventId: string; action: string }>();

  // Handle different routes based on params
  if (eventId) {
    if (action === 'edit') {
      return <EventCreationForm eventId={eventId} />;
    }
    return <ViewEventPage eventId={eventId} />;
  }

  return <EventsListPage />;
};

export default DashboardEvents;
