
import { useEffect } from "react";
import { Event, EventCustomization } from "@/types/event.types";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "@/types/event.types";
import { InvitationRecipient } from "@/types/invitation.types";
import { useState } from "react";

interface UseEditEventEffectProps {
  editEvent?: Event | null;
  form: UseFormReturn<EventFormValues>;
  setRecipients: (recipients: InvitationRecipient[]) => void;
  setIsEditMode: (isEditMode: boolean) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setSelectedDate: (date: Date) => void;
  setIsAllDay: (isAllDay: boolean) => void;
  setStartTime: (startTime: string) => void;
  setEndTime: (endTime: string) => void;
  setLocation: (location: string) => void;
  setLocationTitle?: (title: string) => void; 
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
  setLocationTitle,
  setLocationType,
  setMapsUrl,
  setCustomization
}: UseEditEventEffectProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!editEvent) {
      return;
    }
    
    setIsLoading(true);
    setIsEditMode(true);
    
    // Set form values
    form.setValue("title", editEvent.title);
    form.setValue("description", editEvent.description || "");
    
    // Set component state
    setTitle(editEvent.title);
    setDescription(editEvent.description || "");
    
    // Set date and time values
    const startDate = new Date(editEvent.start_time);
    setSelectedDate(startDate);
    form.setValue("startDate", startDate);
    
    setIsAllDay(editEvent.is_all_day);
    form.setValue("isAllDay", editEvent.is_all_day);
    
    if (!editEvent.is_all_day) {
      const startDateObj = new Date(editEvent.start_time);
      const endDateObj = new Date(editEvent.end_time);
      
      setStartTime(
        `${startDateObj.getHours().toString().padStart(2, '0')}:${startDateObj.getMinutes().toString().padStart(2, '0')}`
      );
      
      setEndTime(
        `${endDateObj.getHours().toString().padStart(2, '0')}:${endDateObj.getMinutes().toString().padStart(2, '0')}`
      );
    }
    
    // Set location values
    if (editEvent.location) {
      setLocation(editEvent.location);
      form.setValue("location", editEvent.location);
    }
    
    // Set location title if available
    if (editEvent.location_title && setLocationTitle) {
      setLocationTitle(editEvent.location_title);
      form.setValue("location_title", editEvent.location_title);
    }
    
    if (editEvent.location_type) {
      setLocationType(editEvent.location_type as 'manual' | 'google_maps');
    }
    
    if (editEvent.maps_url) {
      setMapsUrl(editEvent.maps_url);
    }
    
    // Set customization if present
    if (editEvent.customization) {
      setCustomization(editEvent.customization);
    }
    
    // Set recipients from invitations if present
    if (editEvent.invitations && editEvent.invitations.length > 0) {
      const recipientsList: InvitationRecipient[] = editEvent.invitations.map(inv => ({
        id: inv.id,
        email: inv.email || '',
        name: inv.email || 'Invited User',
        userId: inv.invited_user_id,
        type: inv.email ? 'email' : 'user',
        status: inv.status
      }));
      
      setRecipients(recipientsList);
    }
    
    setIsLoading(false);
  }, [editEvent, form, setRecipients, setIsEditMode, setTitle, setDescription, 
      setSelectedDate, setIsAllDay, setStartTime, setEndTime, setLocation, 
      setLocationTitle, setLocationType, setMapsUrl, setCustomization]);
  
  return { isLoading };
};

export default useEditEventEffect;
