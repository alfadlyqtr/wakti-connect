
import { useCallback } from "react";
import { EventCustomization } from "@/types/event.types";
import { InvitationRecipient } from "@/types/invitation.types";

interface UseFormResetProps {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setSelectedDate: (date: Date) => void;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
  setIsAllDay: (isAllDay: boolean) => void;
  setActiveTab: (tab: "details" | "customize" | "share") => void;
  setRecipients: (recipients: InvitationRecipient[]) => void;
  setLocation: (location: string) => void;
  setLocationType: (type: 'manual' | 'google_maps') => void;
  setMapsUrl: (url: string) => void;
  setCustomization: (customization: EventCustomization) => void;
}

export const useFormReset = ({
  setTitle,
  setDescription,
  setSelectedDate,
  setStartTime,
  setEndTime,
  setIsAllDay,
  setActiveTab,
  setRecipients,
  setLocation,
  setLocationType,
  setMapsUrl,
  setCustomization
}: UseFormResetProps) => {
  const resetForm = useCallback(() => {
    // Reset all form fields to their default values
    setTitle("");
    setDescription("");
    setSelectedDate(new Date());
    setStartTime("09:00");
    setEndTime("10:00");
    setIsAllDay(false);
    setActiveTab("details");
    setRecipients([]);
    setLocation("");
    
    // Set default customization
    setCustomization({
      background: {
        type: 'solid',
        value: '#ffffff',
      },
      font: {
        family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        size: 'medium',
        color: '#333333',
      },
      buttons: {
        accept: {
          background: '#4CAF50',
          color: '#ffffff',
          shape: 'rounded',
        },
        decline: {
          background: '#f44336',
          color: '#ffffff',
          shape: 'rounded',
        }
      },
      headerStyle: 'simple',
      animation: 'fade',
    });
  }, [
    setTitle, setDescription, setSelectedDate, setStartTime, setEndTime, 
    setIsAllDay, setActiveTab, setRecipients, setLocation, setCustomization
  ]);

  return {
    resetForm
  };
};
