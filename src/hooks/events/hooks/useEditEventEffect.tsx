
import { Event, EventCustomization } from "@/types/event.types";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "@/types/event.types";
import { InvitationRecipient } from "@/types/invitation.types";

interface UseEditEventEffectProps {
  editEvent: Event | null | undefined;
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
  // Use this hook to load data from editEvent into form and state
  useEffect(() => {
    if (editEvent) {
      const { title, description, location, customization, is_all_day, start_time, end_time } = editEvent;
      
      setIsEditMode(true);
      
      if (title) {
        setTitle(title);
        form.setValue("title", title);
      }
      
      if (description) {
        setDescription(description);
        form.setValue("description", description);
      }
      
      if (location) {
        setLocation(location);
        form.setValue("location", location);
      }
      
      // If we have start_time, use it for the date
      if (start_time) {
        const startDate = new Date(start_time);
        setSelectedDate(startDate);
        form.setValue("startDate", startDate);
        
        // Extract time portion (HH:MM)
        const hours = startDate.getHours().toString().padStart(2, '0');
        const minutes = startDate.getMinutes().toString().padStart(2, '0');
        setStartTime(`${hours}:${minutes}`);
      }
      
      // If we have end_time, use it for end time
      if (end_time) {
        const endDate = new Date(end_time);
        
        // Extract time portion (HH:MM)
        const hours = endDate.getHours().toString().padStart(2, '0');
        const minutes = endDate.getMinutes().toString().padStart(2, '0');
        setEndTime(`${hours}:${minutes}`);
      }
      
      // Set all-day status
      setIsAllDay(is_all_day || false);
      
      // Set customization if available
      if (customization) {
        setCustomization(customization);
      }
      
      // If there are invitations, transform them to recipients
      if (editEvent.invitations?.length) {
        const recipients = editEvent.invitations.map(inv => ({
          id: inv.id || `email-${Date.now()}`,
          name: inv.email || "",
          email: inv.email || "",
          type: 'email'
        }));
        
        setRecipients(recipients);
      }
      
      // Handle location type and maps URL if present
      if (editEvent.location_type) {
        setLocationType(editEvent.location_type);
        
        if (editEvent.location_type === 'google_maps' && editEvent.maps_url) {
          setMapsUrl(editEvent.maps_url);
        }
      }
    }
  }, [editEvent, form, setIsEditMode, setTitle, setDescription, setSelectedDate, 
      setStartTime, setEndTime, setIsAllDay, setLocation, setCustomization, 
      setRecipients, setLocationType, setMapsUrl]);

  // Return loading state - you can expand this as needed
  return {
    isLoading: false
  };
};

export default useEditEventEffect;
