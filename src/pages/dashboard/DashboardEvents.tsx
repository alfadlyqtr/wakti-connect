
import React from 'react';
import { useParams } from 'react-router-dom';
import EventsListPage from '@/components/events/EventsListPage';
import ViewEventPage from '@/components/events/ViewEventPage';

const DashboardEvents = () => {
  const { eventId } = useParams<{ eventId: string }>();

  if (eventId) {
    return <ViewEventPage eventId={eventId} />;
  }

  return <EventsListPage />;
};

export default DashboardEvents;
