
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Event, EventFormValues, EventCustomization } from '@/types/event.types';
import { InvitationRecipient } from '@/types/invitation.types';
import { parse } from 'date-fns';

interface UseEditEventEffectProps {
  editEvent?: Event | null;
  form: UseFormReturn<EventFormValues>;
  setRecipients: (recipients: InvitationRecipient[]) => void;
  setIsEditMode: (isEditMode: boolean) => void;
}

const useEditEventEffect = ({
  editEvent,
  form,
  setRecipients,
  setIsEditMode
}: UseEditEventEffectProps) => {
  useEffect(() => {
    if (editEvent) {
      setIsEditMode(true);
      
      // Parse the date from string
      const startDate = new Date(editEvent.start_time);
      
      // Convert the database event to the form values format
      const eventData: EventFormValues = {
        title: editEvent.title,
        description: editEvent.description || '',
        location: editEvent.location || '',
        startDate,
        isAllDay: editEvent.is_all_day
      };
      
      // Reset the form with the event data
      form.reset(eventData);
      
      // Convert invitations to recipients
      if (editEvent.invitations && editEvent.invitations.length > 0) {
        const eventRecipients: InvitationRecipient[] = editEvent.invitations.map(invite => ({
          id: invite.id,
          email: invite.email || '',
          userId: invite.invited_user_id || '',
          type: invite.email ? 'email' : 'user',
          status: invite.status
        }));
        
        setRecipients(eventRecipients);
      }
    }
  }, [editEvent, form, setRecipients, setIsEditMode]);
  
  return {
    isLoading: false
  };
};

export default useEditEventEffect;
