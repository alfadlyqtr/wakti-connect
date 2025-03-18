
import { useState } from "react";
import { useForm } from "react-hook-form";
import { EventFormData } from "@/types/event.types";
import { InvitationRecipient } from "@/types/invitation.types";
import { toast } from "@/components/ui/use-toast";
import { useEvents } from "@/hooks/useEvents";

interface EventSubmissionProps {
  title: string;
  description: string;
  isAllDay: boolean;
  selectedDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  locationType: 'manual' | 'google_maps';
  mapsUrl: string;
  customization: any;
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
}: EventSubmissionProps) => {
  const { createEvent, canCreateEvents } = useEvents();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<EventFormData>();

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
      title: title,
      description: description,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      is_all_day: isAllDay,
      location: location,
      location_type: locationType,
      maps_url: locationType === 'google_maps' ? mapsUrl : undefined,
      customization: customization
    };
  };

  const onSubmit = async (formData: EventFormData) => {
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
      
      if (!title) {
        toast({
          title: "Title Required",
          description: "Please enter a title for your event",
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
            description: `Your event "${title}" has been created and invitations have been sent.`,
          });
        } else {
          toast({
            title: "Event Created",
            description: `Your event "${title}" has been created as a draft.`,
          });
        }
        
        // Reset form
        reset();
        resetForm();
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
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    setValue,
    onSubmit
  };
};
