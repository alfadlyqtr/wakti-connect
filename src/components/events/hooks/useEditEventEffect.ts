
import { useEffect } from "react";
import { Event } from "@/types/event.types";
import { InvitationRecipient } from "@/types/invitation.types";

type UseEditEventEffectProps = {
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
};

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
  addRecipient,
}: UseEditEventEffectProps) => {
  useEffect(() => {
    if (editEvent) {
      // Set basic fields
      setTitle(editEvent.title);
      setDescription(editEvent.description || '');
      setValue('title', editEvent.title);
      setValue('description', editEvent.description || '');
      
      // Set date and time
      const startDate = new Date(editEvent.start_time);
      const endDate = new Date(editEvent.end_time);
      setSelectedDate(startDate);
      setIsAllDay(editEvent.is_all_day);
      
      if (!editEvent.is_all_day) {
        const formatTimeString = (date: Date) => {
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        };
        
        setStartTime(formatTimeString(startDate));
        setEndTime(formatTimeString(endDate));
      }
      
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
      
      // Set invitees if any
      if (editEvent.invitations && editEvent.invitations.length > 0) {
        editEvent.invitations.forEach(invitation => {
          if (invitation.email) {
            addRecipient({
              id: invitation.id,
              name: invitation.email,
              email: invitation.email,
              type: 'email'
            });
          } else if (invitation.invited_user_id) {
            // In a real app, you'd fetch the user's details
            addRecipient({
              id: invitation.id,
              name: `User ${invitation.invited_user_id.substring(0, 5)}...`,
              type: 'contact'
            });
          }
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
