
import { useCallback } from "react";
import { EventCustomization } from "@/types/event.types";

interface ResetFormParams {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setSelectedDate: (date: Date) => void;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
  setIsAllDay: (isAllDay: boolean) => void;
  setActiveTab: (tab: string) => void;
  setRecipients: (recipients: any[]) => void;
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
}: ResetFormParams) => {
  
  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setSelectedDate(new Date());
    setStartTime("09:00");
    setEndTime("10:00");
    setIsAllDay(false);
    setActiveTab("details");
    setRecipients([]);
    setLocation('');
    setLocationType('manual');
    setMapsUrl('');
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
  ]);

  return { resetForm };
};
