
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Event, EventTab, EventsResult, EventFormData } from "@/types/event.types";
import { getEvents } from "@/services/event/getEvents";

export const useEvents = (tab: EventTab = "my-events") => {
  const queryClient = useQueryClient();

  const { 
    data = { events: [], userRole: 'free', canCreateEvents: false }, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['events', tab],
    queryFn: async () => {
      try {
        const result = await getEvents(tab);
        return result;
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
        throw error;
      }
    }
  });

  const createEvent = useMutation({
    mutationFn: async (eventData: EventFormData) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          throw new Error("Not authenticated");
        }

        // Format dates for the database and prepare the formatted data
        const formattedData = {
          title: eventData.title,
          description: eventData.description || null,
          location: eventData.location || null,
          location_title: eventData.location_title || null,
          start_time: eventData.startDate.toISOString(),
          end_time: eventData.endDate ? eventData.endDate.toISOString() : eventData.startDate.toISOString(),
          is_all_day: eventData.isAllDay || false,
          // Convert status to a string literal type that matches the database expectations
          status: (eventData.status || 'published') as 'draft' | 'sent' | 'accepted' | 'declined' | 'recalled',
          user_id: session.user.id
        };

        // Handle customization as a separate object we'll stringify for the database
        let customizationJson = null;
        if (eventData.customization) {
          customizationJson = JSON.stringify(eventData.customization);
        }

        // Insert the event with the stringified customization
        const { data, error } = await supabase
          .from('events')
          .insert([{
            ...formattedData,
            customization: customizationJson
          }])
          .select();

        if (error) {
          console.error("Error creating event:", error);
          throw error;
        }

        if (!data || data.length === 0) {
          throw new Error("No data returned after creating event");
        }

        const createdEvent = data[0];

        // Handle invitations if present
        if (eventData.invitations && eventData.invitations.length > 0) {
          const invitationData = eventData.invitations.map(invite => ({
            event_id: createdEvent.id,
            invited_user_id: invite.invited_user_id || null,
            email: invite.email || null,
            status: invite.status || 'pending',
            shared_as_link: invite.shared_as_link || false,
          }));

          const { error: inviteError } = await supabase
            .from('event_invitations')
            .insert(invitationData);

          if (inviteError) {
            console.error("Error creating invitations:", inviteError);
          }
        }

        return createdEvent;
      } catch (error) {
        console.error("Error in createEvent:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Event created successfully");
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    }
  });

  const updateEvent = useMutation({
    mutationFn: async ({ id, eventData }: { id: string; eventData: Partial<EventFormData> }) => {
      try {
        // Format dates for database if present
        const formattedData: any = { ...eventData };
        if (eventData.startDate) {
          formattedData.start_time = eventData.startDate.toISOString();
          delete formattedData.startDate;
        }
        if (eventData.endDate) {
          formattedData.end_time = eventData.endDate.toISOString();
          delete formattedData.endDate;
        }
        if ('isAllDay' in eventData) {
          formattedData.is_all_day = eventData.isAllDay;
          delete formattedData.isAllDay;
        }
        
        // Handle customization if present
        if (formattedData.customization) {
          formattedData.customization = JSON.stringify(formattedData.customization);
        }
        
        // Ensure status is compatible with database expectations if it's being updated
        if (formattedData.status) {
          // Cast to allowed types in the database
          formattedData.status = formattedData.status as 'draft' | 'sent' | 'accepted' | 'declined' | 'recalled';
        }
        
        const { data, error } = await supabase
          .from('events')
          .update(formattedData)
          .eq('id', id)
          .select();

        if (error) throw error;
        return data ? data[0] : null;
      } catch (error) {
        console.error("Error updating event:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Event updated successfully");
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      toast.error("Failed to update event");
      console.error("Error updating event:", error);
    }
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      toast.success("Event deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      toast.error("Failed to delete event");
      console.error("Error deleting event:", error);
    }
  });

  return {
    events: data.events,
    userRole: data.userRole,
    canCreateEvents: data.canCreateEvents,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refreshEvents: refetch
  };
};
