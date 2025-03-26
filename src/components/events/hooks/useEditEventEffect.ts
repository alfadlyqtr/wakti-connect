
import { useEffect } from "react";
import { Event } from "@/types/event.types";
import { InvitationRecipient } from "@/types/invitation.types";

interface UseEditEventEffectProps {
  editEvent: Event | null;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setValue: (name: string, value: any) => void;
  setSelectedDate: (date: Date) => void;
  setIsAllDay: (isAllDay: boolean) => void;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
  handleLocationChange: (location: string, type: 'manual' | 'google_maps', mapsUrl?: string) => void;
  setCustomization: (customization: any) => void;
  addRecipient: (recipient: InvitationRecipient) => void;
}

export const useEditEventEffect = ({
  editEvent,
  setTitle,
  setDescription,
  setValue,
  setSelectedDate,
  setIsAllDay,
  setStartTime,
  setEndTime,
  handleLocationChange,
  setCustomization,
  addRecipient
}: UseEditEventEffectProps) => {
  useEffect(() => {
    if (editEvent) {
      // Populate form with edit event data
      setTitle(editEvent.title || '');
      setDescription(editEvent.description || '');
      setValue('title', editEvent.title || '');
      setValue('description', editEvent.description || '');
      
      // Set date and time
      if (editEvent.start_time) {
        const startDate = new Date(editEvent.start_time);
        setSelectedDate(startDate);
        
        if (!editEvent.is_all_day) {
          const hours = startDate.getHours().toString().padStart(2, '0');
          const minutes = startDate.getMinutes().toString().padStart(2, '0');
          setStartTime(`${hours}:${minutes}`);
        }
      }
      
      if (editEvent.end_time) {
        const endDate = new Date(editEvent.end_time);
        
        if (!editEvent.is_all_day) {
          const hours = endDate.getHours().toString().padStart(2, '0');
          const minutes = endDate.getMinutes().toString().padStart(2, '0');
          setEndTime(`${hours}:${minutes}`);
        }
      }
      
      // Set all day flag
      setIsAllDay(editEvent.is_all_day);
      
      // Set location
      if (editEvent.location) {
        handleLocationChange(
          editEvent.location,
          editEvent.location_type || 'manual',
          editEvent.maps_url
        );
      }
      
      // Set customization
      if (editEvent.customization) {
        setCustomization(editEvent.customization);
      }
      
      // Set invitations if available
      if (editEvent.invitations && editEvent.invitations.length > 0) {
        editEvent.invitations.forEach(invitation => {
          const recipient: InvitationRecipient = {
            type: invitation.invited_user_id ? 'user' : 'email',
            id: invitation.invited_user_id || invitation.email || '',
            status: invitation.status
          };
          addRecipient(recipient);
        });
      }
    }
  }, [
    editEvent, 
    setTitle, 
    setDescription, 
    setValue, 
    setSelectedDate, 
    setIsAllDay, 
    setStartTime, 
    setEndTime, 
    handleLocationChange, 
    setCustomization, 
    addRecipient
  ]);
};
