
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { InvitationRecipient } from "@/types/invitation.types";
import { EventWithInvitations } from "@/types/event.types";

type EventFormValues = {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  location?: string;
  recipients: InvitationRecipient[];
};

const useEditEventEffect = (
  form: any,
  setIsLoading: (loading: boolean) => void,
  setBackgroundImage: (url: string | null) => void,
  setTemplateId: (id: string | null) => void,
  setCustomizationId: (id: string | null) => void,
  setActiveTab: (tab: string) => void
) => {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [originalEvent, setOriginalEvent] = useState<EventWithInvitations | null>(null);

  useEffect(() => {
    const loadEventData = async () => {
      if (!params.id) return;
      
      setIsLoading(true);
      
      try {
        // Try to get event from query cache first
        const cachedEvent = queryClient.getQueryData<EventWithInvitations[]>(['sentInvitations'])?.find(
          event => event.id === params.id
        );
        
        if (cachedEvent) {
          applyEventData(cachedEvent);
          setOriginalEvent(cachedEvent);
        } else {
          // Fetch event directly if not in cache
          const { data: event } = await fetch(`/api/events/${params.id}`).then(res => res.json());
          
          if (event) {
            applyEventData(event);
            setOriginalEvent(event);
          }
        }
      } catch (error) {
        console.error("Failed to load event:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEventData();
  }, [params.id, queryClient, setIsLoading, form, setBackgroundImage, setTemplateId, setCustomizationId]);
  
  const applyEventData = (event: EventWithInvitations) => {
    if (!event) return;
    
    // Parse dates
    const startTime = new Date(event.start_time);
    const endTime = new Date(event.end_time);
    
    // Set form values
    form.reset({
      title: event.title,
      description: event.description || '',
      startTime,
      endTime,
      isAllDay: event.is_all_day || false,
      location: event.location || '',
      recipients: event.event_invitations?.map(invitation => ({
        id: invitation.invited_user_id || invitation.email || '',
        name: invitation.invited_user_id ? 'Contact' : (invitation.email || ''),
        email: invitation.email,
        type: invitation.invited_user_id ? 'contact' : 'email'
      })) || []
    });
    
    // Set customization data if available
    if (event.customization) {
      setTemplateId(event.customization.templateId || null);
      setCustomizationId(event.customization.id || null);
      
      if (event.customization.backgroundType === 'image') {
        setBackgroundImage(event.customization.backgroundValue || null);
      }
    }
    
    // Move to the first tab
    setActiveTab('details');
  };
  
  return {
    originalEventId: params.id,
    originalEvent
  };
};

export default useEditEventEffect;
