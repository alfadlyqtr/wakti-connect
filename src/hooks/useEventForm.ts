
import { useCallback } from "react";
import { useEvents } from "@/hooks/useEvents";
import { EventFormData, Event } from "@/types/event.types";
import { 
  useEventBasics, 
  useEventLocation, 
  useEventRecipients, 
  useEventSubmission,
  useFormReset
} from "./events";
import { useEffect } from "react";

export const useEventForm = (editEvent?: Event | null, onSuccess?: () => void) => {
  const { canCreateEvents, userRole } = useEvents();
  
  // Use our smaller, focused hooks
  const {
    title,
    setTitle,
    description,
    setDescription,
    isAllDay,
    setIsAllDay,
    selectedDate,
    setSelectedDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    activeTab,
    setActiveTab,
    customization,
    setCustomization,
    handleNextTab,
    handlePrevTab
  } = useEventBasics();
  
  const {
    location,
    locationType,
    mapsUrl,
    handleLocationChange
  } = useEventLocation();
  
  const {
    recipients,
    shareTab,
    setShareTab,
    addRecipient,
    removeRecipient,
    handleSendEmail
  } = useEventRecipients();

  // The resetForm hook needs access to all the setter functions
  const { resetForm } = useFormReset({
    setTitle,
    setDescription,
    setSelectedDate,
    setStartTime,
    setEndTime,
    setIsAllDay,
    setActiveTab,
    setRecipients: useCallback((newRecipients) => {
      // We need to wrap this in useCallback since useFormReset expects a function
      // but we don't expose setRecipients directly from useEventRecipients
      if (newRecipients.length === 0) {
        recipients.forEach((_, index) => removeRecipient(index));
      }
    }, [recipients, removeRecipient]),
    setLocation: useCallback((loc) => handleLocationChange(loc, 'manual'), [handleLocationChange]),
    setLocationType: useCallback((type) => {
      handleLocationChange(location, type);
    }, [handleLocationChange, location]),
    setMapsUrl: useCallback(() => {
      // This is just a placeholder as we don't set mapsUrl directly
      // It's handled by handleLocationChange
    }, []),
    setCustomization
  });
  
  // The submission hook needs values from all other hooks
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    setValue,
    onSubmit
  } = useEventSubmission({
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
  });

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    activeTab,
    setActiveTab,
    isAllDay,
    setIsAllDay,
    selectedDate,
    setSelectedDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    recipients,
    location,
    locationType,
    mapsUrl,
    customization,
    setCustomization,
    shareTab,
    setShareTab,
    canCreateEvents,
    userRole,
    addRecipient,
    removeRecipient,
    handleLocationChange,
    handleNextTab,
    handlePrevTab,
    handleSendEmail,
    onSubmit,
    setValue,
    title,
    setTitle,
    description,
    setDescription
  };
};
