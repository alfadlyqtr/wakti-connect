
import { useState, useEffect, useCallback } from 'react';
import { Event, EventTab, EventStatus, EventFormData } from '@/types/event.types';
import { createEvent } from '@/services/event/createService';
import { updateEvent } from '@/services/event/updateService';
import { deleteEvent as deleteEventService } from '@/services/event/deleteService';
import { getEvents } from '@/services/event/getEvents';
import { respondToInvitation as respondService } from '@/services/event/respondToInvitation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export const useEvents = (tab?: EventTab) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const { user } = useAuth();
  const { toast } = useToast();
  const [canCreateEvents, setCanCreateEvents] = useState(false);
  const [userRole, setUserRole] = useState<'free' | 'individual' | 'business'>('free');

  const fetchEvents = useCallback(async () => {
    if (!user) {
      setEvents([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const result = await getEvents(tab || 'my-events');
      setEvents(result.events);
      setUserRole(result.userRole);
      setCanCreateEvents(result.userRole !== 'free');
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, tab, toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Filter events based on search query, status, and date
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    
    let matchesDate = true;
    if (filterDate) {
      const eventDate = new Date(event.start_time);
      const filterDateString = format(filterDate, 'yyyy-MM-dd');
      const eventDateString = format(eventDate, 'yyyy-MM-dd');
      matchesDate = filterDateString === eventDateString;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Create event
  const createEventAction = useCallback(async (eventData: EventFormData): Promise<Event> => {
    try {
      const result = await createEvent(eventData);
      await fetchEvents();  // Refresh events after creation
      return result;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }, [fetchEvents]);

  // Update event
  const updateEventAction = useCallback(async (eventId: string, eventData: EventFormData): Promise<Event> => {
    try {
      const result = await updateEvent(eventId, eventData);
      await fetchEvents();  // Refresh events after update
      return result;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }, [fetchEvents]);

  // Delete event
  const deleteEventAction = useCallback(async (eventId: string): Promise<void> => {
    try {
      await deleteEventService(eventId);
      await fetchEvents();  // Refresh events after deletion
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }, [fetchEvents]);

  // Respond to invitation
  const respondToInvitation = useCallback(async (eventId: string, response: 'accepted' | 'declined'): Promise<void> => {
    try {
      await respondService(eventId, response);
      await fetchEvents();  // Refresh events after responding
    } catch (error) {
      console.error('Error responding to invitation:', error);
      throw error;
    }
  }, [fetchEvents]);

  return {
    events,
    filteredEvents,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterDate,
    setFilterDate,
    canCreateEvents,
    userRole,
    createEvent: createEventAction,
    updateEvent: updateEventAction,
    deleteEvent: deleteEventAction,
    respondToInvitation,
    refetch: fetchEvents
  };
};
