
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UseFormReturn } from 'react-hook-form';
import { EventFormValues } from '@/types/event.types';
import { InvitationRecipient } from '@/types/invitation.types';
import { useEvents } from '@/hooks/useEvents';

const useEditEventEffect = (
  form: UseFormReturn<EventFormValues>,
  setRecipients: React.Dispatch<React.SetStateAction<InvitationRecipient[]>>,
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { eventId } = useParams<{ eventId: string }>();
  const { getEventById } = useEvents();
  
  useEffect(() => {
    if (!eventId) return;
    
    const fetchEventData = async () => {
      setIsLoading(true);
      try {
        const event = await getEventById(eventId);
        
        if (event) {
          // Set edit mode
          setIsEditMode(true);
          
          // Set form data
          form.reset({
            title: event.title,
            description: event.description || '',
            location: event.location || '',
            startDate: event.start_time ? new Date(event.start_time) : undefined,
            endDate: event.end_time ? new Date(event.end_time) : undefined,
            isAllDay: event.is_all_day
          });
          
          // Set recipients from invitations if available
          if (event.invitations && event.invitations.length > 0) {
            const formattedRecipients: InvitationRecipient[] = event.invitations.map(invitation => {
              if (invitation.email) {
                return {
                  id: invitation.id,
                  name: invitation.email,
                  email: invitation.email,
                  type: 'email'
                };
              } else if (invitation.invited_user_id) {
                return {
                  id: invitation.id,
                  name: `User ${invitation.invited_user_id.substring(0, 8)}`,
                  type: 'contact'
                };
              }
              
              // Default fallback
              return {
                id: invitation.id,
                name: `Recipient ${invitation.id.substring(0, 8)}`,
                type: 'contact'
              };
            });
            
            setRecipients(formattedRecipients);
          }
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEventData();
  }, [eventId, form, setRecipients, setIsEditMode, getEventById]);
  
  return { isLoading };
};

export default useEditEventEffect;
