
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import FormHeader from './FormHeader';
import FormTabs from './FormTabs';
import { EventFormValues, eventSchema, EventStatus, EventFormTab, EventCustomization } from '@/types/event.types';
import { InvitationRecipient } from '@/types/invitation.types';
import { initialCustomization } from '@/components/events/customize/initial-customization';
import { createEvent } from '@/services/event/createService';
import { getEventById, updateEvent } from '@/services/event/eventService';
import { sendEventInvitation } from '@/services/invitation/invitationService';
import { ShareTab } from '@/types/form.types';
import { useEventBasics } from '@/hooks/events/useEventBasics';
import { useEventLocation } from '@/hooks/events/useEventLocation';
import { useEventRecipients } from '@/hooks/events/useEventRecipients';
import { useFormReset } from '@/hooks/events/useFormReset';
import useEditEventEffect from '@/hooks/events/useEditEventEffect';

interface EventCreationFormProps {
  eventId?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const EventCreationForm: React.FC<EventCreationFormProps> = ({
  eventId,
  onCancel,
  onSuccess
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Event form and fields state
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      location: '',
      startDate: new Date(),
      isAllDay: false
    }
  });

  // Event basic state hooks
  const {
    title, setTitle,
    description, setDescription,
    isAllDay, setIsAllDay,
    selectedDate, setSelectedDate,
    startTime, setStartTime,
    endTime, setEndTime,
    activeTab, setActiveTab,
    customization, setCustomization
  } = useEventBasics();

  // Event location state hooks
  const {
    location, locationTitle,
    locationType, mapsUrl,
    handleLocationChange,
    isGettingLocation
  } = useEventLocation();

  // Event recipients state hooks
  const {
    recipients, shareTab, setShareTab,
    addRecipient, removeRecipient,
    handleSendEmail
  } = useEventRecipients();

  // Event edit/create state
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editEvent, setEditEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(!!eventId);

  // Reset form state hook
  const { resetForm } = useFormReset({
    setTitle,
    setDescription,
    setSelectedDate,
    setStartTime,
    setEndTime,
    setIsAllDay,
    setActiveTab,
    setRecipients: (newRecipients) => recipients.length = 0,
    setLocation: handleLocationChange,
    setLocationType: (type) => handleLocationChange(location, type, mapsUrl, locationTitle),
    setMapsUrl: (url) => handleLocationChange(location, locationType, url, locationTitle),
    setCustomization
  });

  // Set up edit effect hook
  useEditEventEffect({
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
    setLocation: (loc) => handleLocationChange(loc),
    setLocationType: (type) => handleLocationChange(location, type, mapsUrl, locationTitle),
    setMapsUrl: (url) => handleLocationChange(location, locationType, url, locationTitle),
    setCustomization
  });

  // Function to set recipients for external use
  function setRecipients(newRecipients: InvitationRecipient[]) {
    // Clear the current recipients array and add the new ones
    recipients.length = 0;
    newRecipients.forEach(recipient => addRecipient(recipient));
  }

  // Fetch event data if in edit mode
  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        try {
          const event = await getEventById(eventId);
          if (event) {
            setEditEvent(event);
          } else {
            toast({
              title: "Event not found",
              description: "The event you're trying to edit doesn't exist.",
              variant: "destructive"
            });
            navigate("/dashboard/events");
          }
        } catch (error) {
          console.error("Error fetching event:", error);
          toast({
            title: "Error",
            description: "Failed to load event data",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchEvent();
    }
  }, [eventId, navigate, toast]);

  // Handle form submission
  const handleSubmit = async (status: EventStatus = 'draft') => {
    try {
      setIsSubmitting(true);
      
      // Prepare event data
      const eventData = {
        title,
        description,
        location,
        location_title: locationTitle,
        startDate: selectedDate,
        start_time: isAllDay ? undefined : `${selectedDate.toISOString().split('T')[0]}T${startTime}:00`,
        end_time: isAllDay ? undefined : `${selectedDate.toISOString().split('T')[0]}T${endTime}:00`,
        isAllDay,
        is_all_day: isAllDay,
        status: status as EventStatus,
        customization,
        location_type: locationType,
        maps_url: mapsUrl
      };
      
      let eventId: string | undefined;
      
      // Create or update event
      if (isEditMode && editEvent?.id) {
        // Update existing event
        const updated = await updateEvent(editEvent.id, eventData);
        if (updated) {
          eventId = editEvent.id;
          toast({
            title: "Success",
            description: "Event updated successfully",
          });
        }
      } else {
        // Create new event
        const created = await createEvent(eventData);
        if (created) {
          eventId = created.id;
          toast({
            title: "Success",
            description: "Event created successfully",
          });
        }
      }
      
      // Send invitations if recipients exist and we have an event ID
      if (eventId && recipients.length > 0) {
        for (const recipient of recipients) {
          if (recipient.email) {
            await sendEventInvitation(eventId, recipient.email);
          }
        }
      }
      
      // Handle success callback or navigate
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/dashboard/events/view/${eventId}`);
      }
      
    } catch (error: any) {
      console.error("Error submitting event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle email sending
  const handleEmailSend = (email: string) => {
    // Make sure this is a valid email before adding
    if (email && email.includes('@')) {
      // Create a new invitation recipient
      const newRecipient: InvitationRecipient = {
        id: `temp-${Date.now()}`,
        name: email,
        email: email,
        type: 'email',
        status: 'pending'
      };
      
      addRecipient(newRecipient);
      toast({
        title: "Recipient added",
        description: `${email} has been added to the invitation list`
      });
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/dashboard/events");
    }
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    await handleSubmit('draft');
  };

  return (
    <div className="max-w-4xl mx-auto my-8">
      <Card className="shadow-lg">
        <FormHeader 
          isEdit={isEditMode} 
          isLoading={isLoading} 
          onCancel={handleCancel} 
        />
        
        <CardContent>
          <FormTabs 
            activeTab={activeTab as EventFormTab}
            setActiveTab={setActiveTab}
            title={title}
            description={description}
            selectedDate={selectedDate}
            location={location}
            locationTitle={locationTitle}
            startTime={startTime}
            endTime={endTime}
            customization={customization}
            onCustomizationChange={setCustomization}
            recipients={recipients}
            addRecipient={addRecipient}
            removeRecipient={removeRecipient}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onDateChange={setSelectedDate}
            onLocationChange={handleLocationChange}
            onStartTimeChange={setStartTime}
            onEndTimeChange={setEndTime}
            onIsAllDayChange={setIsAllDay}
            isAllDay={isAllDay}
            locationType={locationType}
            mapsUrl={mapsUrl}
            getCurrentLocation={() => {}}
            isGettingLocation={isGettingLocation}
            shareTab={shareTab}
            setShareTab={setShareTab}
            onSendEmail={handleEmailSend}
            handleSaveDraft={handleSaveDraft}
          />
          
          {activeTab === "share" && (
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium"
                onClick={() => handleSubmit('published')}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventCreationForm;
