
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { EventWithInvitations } from "@/types/event.types"; // Make sure this type exists
import { InvitationRecipient } from "@/types/invitation.types";
import { supabase } from "@/integrations/supabase/client";

// This hook is meant to be used in the EventCreationForm component
// to handle loading an existing event for editing
const useEditEventEffect = (
  form: ReturnType<typeof useForm>,
  setRecipients: (recipients: InvitationRecipient[]) => void,
  setIsEditMode: (isEdit: boolean) => void
) => {
  const { eventId } = useParams<{ eventId: string }>();
  
  const { data: eventData, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) return null;
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_invitations(*)
        `)
        .eq('id', eventId)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as EventWithInvitations;
    },
    enabled: !!eventId,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Failed to load event",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  });
  
  useEffect(() => {
    if (eventId && eventData) {
      setIsEditMode(true);
      
      // Set basic form values
      form.reset({
        title: eventData.title,
        description: eventData.description || '',
        location: eventData.location || '',
        startDate: eventData.start_time ? new Date(eventData.start_time) : undefined,
        endDate: eventData.end_time ? new Date(eventData.end_time) : undefined,
        isAllDay: eventData.is_all_day || false,
      });
      
      // Set invitation recipients if available
      if (eventData.event_invitations && eventData.event_invitations.length > 0) {
        // Map invitations to recipient format
        const recipients: InvitationRecipient[] = eventData.event_invitations.map(invitation => ({
          id: invitation.invited_user_id || invitation.email || '',
          name: invitation.invited_user_id ? 'Contact User' : invitation.email || '',
          email: invitation.email,
          type: invitation.invited_user_id ? 'contact' : 'email'
        }));
        
        setRecipients(recipients);
      }
    }
  }, [eventId, eventData, form, setRecipients, setIsEditMode]);
  
  return {
    isLoading,
    eventData
  };
};

export default useEditEventEffect;
