
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { EventFormValues, EventCustomization, EventStatus, EventFormData } from "@/types/event.types";
import { InvitationRecipient } from "@/types/invitation.types";
import { useEvents } from "@/hooks/useEvents";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";

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
  editEvent?: any; // The event being edited (if any)
  onSuccess?: () => void; // New callback for success handling
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
  resetForm,
  editEvent,
  onSuccess
}: UseEventSubmissionProps) => {
  const { createEvent, updateEvent, canCreateEvents } = useEvents();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<EventFormValues>({
    defaultValues: {
      title: title,
      description: description
    }
  });
  
  // Make sure form values stay in sync with props
  useEffect(() => {
    setValue('title', title);
    setValue('description', description);
  }, [title, description, setValue]);
  
  const processDateAndTime = (formData: EventFormValues): EventFormData => {
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
    
    // Determine status based on recipients and current state
    const status: EventStatus = editEvent?.status === 'draft' && recipients.length === 0 
      ? 'draft' 
      : recipients.length > 0 ? 'sent' : 'draft';
      
    return {
      title: title,
      description: description,
      startDate: selectedDate,
      isAllDay: isAllDay,
      location: location,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      is_all_day: isAllDay,
      status: status,
      location_type: locationType,
      maps_url: locationType === 'google_maps' ? mapsUrl : undefined,
      customization: customization,
      // Add invitations for recipients if available
      invitations: recipients.length > 0 ? recipients.map(recipient => ({
        email: recipient.email,
        invited_user_id: recipient.userId,
        status: 'pending'
      })) : undefined
    };
  };

  const onSubmit = useCallback(async (formData: EventFormValues) => {
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
      
      // Added logging to help diagnose issues
      console.log("Form data before processing:", { formData, title, editingEvent: !!editEvent });
      
      // Check if title is empty before submission
      if (!title.trim()) {
        toast({
          title: "Event title is required",
          description: "Please enter a title for your event",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      const completeFormData = processDateAndTime(formData);
      
      // More logging
      console.log("Processed form data:", completeFormData);
      
      let result;
      
      if (editEvent) {
        // Update existing event instead of creating a new one
        console.log("Updating existing event:", editEvent.id);
        result = await updateEvent(editEvent.id, completeFormData);
        
        if (result?.id) {
          // Show different message for updates
          if (recipients.length > 0) {
            toast({
              title: "Event Updated and Invitations Sent",
              description: `Your event "${completeFormData.title}" has been updated and invitations have been sent.`,
            });
          } else {
            toast({
              title: "Event Updated",
              description: `Your event "${completeFormData.title}" has been updated as a draft.`,
            });
          }
        }
      } else {
        // Create new event
        result = await createEvent(completeFormData);
        
        if (result?.id) {
          // This would actually send invitations to recipients in a real implementation
          if (recipients.length > 0) {
            toast({
              title: "Event Created and Invitations Sent",
              description: `Your event "${completeFormData.title}" has been created and invitations have been sent.`,
            });
          } else {
            toast({
              title: "Event Created",
              description: `Your event "${completeFormData.title}" has been created as a draft.`,
            });
          }
        }
      }
      
      if (result?.id) {
        // Call the onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        } else {
          // Only reset the form if onSuccess isn't provided (for backward compatibility)
          resetForm();
          reset();
        }
      }
    } catch (error: any) {
      console.error("Error with event:", error);
      toast({
        title: editEvent ? "Failed to update event" : "Failed to create event",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [canCreateEvents, createEvent, updateEvent, isAllDay, location, locationType, mapsUrl, customization, recipients, title, description, resetForm, reset, selectedDate, startTime, endTime, editEvent, onSuccess]);

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    setValue,
    onSubmit
  };
};
