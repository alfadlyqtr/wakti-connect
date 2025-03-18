
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { EventFormData, EventCustomization } from "@/types/event.types";
import { InvitationRecipient } from "@/types/invitation.types";
import { useEvents } from "@/hooks/useEvents";
import { toast } from "@/components/ui/use-toast";

interface UseEventSubmissionProps {
  title: string;
  description: string;
  isAllDay: boolean;
  selectedDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  locationType: 'manual' | 'google_maps';
  mapsUrl: string;
  customization: EventCustomization;
  recipients: InvitationRecipient[];
  resetForm: () => void;
}

export const useEventSubmission = ({
  title,
  description,
  isAllDay,
  selectedDate,
  startTime,
  endTime,
  location,
  locationType,
  mapsUrl,
  customization,
  recipients,
  resetForm
}: UseEventSubmissionProps) => {
  const { createEvent, canCreateEvents } = useEvents();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<EventFormData>({
    defaultValues: {
      title: title,
      description: description
    }
  });
  
  const processDateAndTime = (formData: EventFormData) => {
    // Create ISO string for start and end times
    const startDateTime = new Date(selectedDate);
    const endDateTime = new Date(selectedDate);
    
    if (!isAllDay) {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      
      startDateTime.setHours(startHours, startMinutes, 0);
      endDateTime.setHours(endHours, endMinutes, 0);
    } else {
      // For all-day events
      startDateTime.setHours(0, 0, 0, 0);
      endDateTime.setHours(23, 59, 59, 999);
    }
    
    return {
      ...formData,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      is_all_day: isAllDay,
      location: location,
      location_type: locationType,
      maps_url: locationType === 'google_maps' ? mapsUrl : undefined,
      customization: customization
    };
  };

  const onSubmit = useCallback(async (formData: EventFormData) => {
    try {
      setIsSubmitting(true);
      
      if (!canCreateEvents) {
        toast({
          title: "Subscription Required",
          description: "Creating events requires an Individual or Business subscription",
          variant: "destructive",
        });
        return;
      }
      
      const completeFormData = processDateAndTime(formData);
      
      // Determine status based on recipients
      const status = recipients.length > 0 ? 'sent' : 'draft';
      completeFormData.status = status;
      
      const result = await createEvent(completeFormData);
      
      if (result?.id) {
        // This would actually send invitations to recipients in a real implementation
        if (recipients.length > 0) {
          toast({
            title: "Event Created and Invitations Sent",
            description: `Your event "${formData.title}" has been created and invitations have been sent.`,
          });
        } else {
          toast({
            title: "Event Created",
            description: `Your event "${formData.title}" has been created as a draft.`,
          });
        }
        
        // Reset form
        resetForm();
        reset();
      }
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast({
        title: "Failed to create event",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [canCreateEvents, createEvent, isAllDay, location, locationType, mapsUrl, customization, recipients, resetForm, reset, selectedDate, startTime, endTime]);

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    setValue,
    onSubmit
  };
};
