
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Event, EventFormValues, EventCustomization } from '@/types/event.types';
import { InvitationRecipient } from '@/types/invitation.types';
import { format } from 'date-fns';

interface UseEditEventEffectProps {
  editEvent?: Event | null;
  form: UseFormReturn<EventFormValues>;
  setRecipients: (recipients: InvitationRecipient[]) => void;
  setIsEditMode: (isEdit: boolean) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setSelectedDate: (date: Date) => void;
  setIsAllDay: (isAllDay: boolean) => void;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
  setLocation: (location: string) => void;
  setLocationType: (type: 'manual' | 'google_maps') => void;
  setMapsUrl: (url: string) => void;
  setCustomization: (customization: EventCustomization) => void;
}

const useEditEventEffect = ({
  editEvent,
  form,
  setRecipients,
  setIsEditMode,
  setTitle,
  setDescription,
  setSelectedDate,
  setIsAllDay,
  setStartTime,
  setEndTime,
  setLocation,
  setLocationType,
  setMapsUrl,
  setCustomization
}: UseEditEventEffectProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (editEvent) {
      setIsEditMode(true);
      
      // Set form values
      form.reset({
        title: editEvent.title,
        description: editEvent.description || '',
        location: editEvent.location || '',
        startDate: new Date(editEvent.start_time),
        endDate: editEvent.end_time ? new Date(editEvent.end_time) : undefined,
        isAllDay: editEvent.is_all_day
      });
      
      // Set local state
      setTitle(editEvent.title);
      setDescription(editEvent.description || '');
      setSelectedDate(new Date(editEvent.start_time));
      setIsAllDay(editEvent.is_all_day);
      setLocation(editEvent.location || '');
      
      // Handle time
      const startDateTime = new Date(editEvent.start_time);
      const endDateTime = editEvent.end_time ? new Date(editEvent.end_time) : new Date(startDateTime);
      
      setStartTime(format(startDateTime, 'HH:mm'));
      setEndTime(format(endDateTime, 'HH:mm'));
      
      // Set customization
      if (editEvent.customization) {
        setCustomization(editEvent.customization);
      }
      
      // Handle invitations
      if (editEvent.invitations && editEvent.invitations.length > 0) {
        const recipientsList: InvitationRecipient[] = editEvent.invitations.map(invitation => ({
          id: invitation.id,
          name: invitation.email || invitation.invited_user_id || '',
          email: invitation.email,
          userId: invitation.invited_user_id,
          type: invitation.email ? 'email' : 'user',
          status: invitation.status
        }));
        
        setRecipients(recipientsList);
      }
    }
    
    setIsLoading(false);
  }, [editEvent, form, setRecipients, setIsEditMode, setTitle, setDescription, setSelectedDate, setIsAllDay, setStartTime, setEndTime, setLocation, setLocationType, setMapsUrl, setCustomization]);

  return {
    isLoading
  };
};

export default useEditEventEffect;
