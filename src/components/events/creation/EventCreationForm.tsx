
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventSchema, EventFormValues, EventStatus, EventCustomization, EventFormTab } from '@/types/event.types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import FormHeader from './FormHeader';
import FormTabs from './FormTabs';
import { initialCustomization } from '../customize/initial-customization';
import { InvitationRecipient } from '@/types/invitation.types';
import { createEvent, updateEvent } from '@/services/event/eventService';
import { ShareTab } from '@/types/form.types';

interface EventCreationFormProps {
  eventId?: string;
}

const EventCreationForm: React.FC<EventCreationFormProps> = ({ eventId }) => {
  const isEditMode = !!eventId;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data and state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [location, setLocation] = useState('');
  const [locationTitle, setLocationTitle] = useState('');
  const [locationType, setLocationType] = useState<'manual' | 'google_maps'>('manual');
  const [mapsUrl, setMapsUrl] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [isAllDay, setIsAllDay] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [customization, setCustomization] = useState<EventCustomization>(initialCustomization);
  const [activeTab, setActiveTab] = useState<EventFormTab>('details');
  const [shareTab, setShareTab] = useState<ShareTab>('recipients');
  const [recipients, setRecipients] = useState<InvitationRecipient[]>([]);

  // Setup form with Zod validation
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      location_title: '',
      startDate: new Date(),
      endDate: undefined,
      isAllDay: false
    }
  });

  // Fetch existing event data for edit mode
  const { data: eventData, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) return null;
      
      const { data, error } = await supabase
        .from('events')
        .select('*, invitations:event_invitations(*)')
        .eq('id', eventId)
        .single();
        
      if (error) throw error;
      
      return data;
    },
    enabled: isEditMode
  });

  // Populate form when editing an existing event
  useEffect(() => {
    if (eventData) {
      try {
        setTitle(eventData.title || '');
        setDescription(eventData.description || '');
        
        if (eventData.start_time) {
          const startDate = new Date(eventData.start_time);
          setSelectedDate(startDate);
          
          // Format start time
          if (!eventData.is_all_day) {
            const hours = String(startDate.getHours()).padStart(2, '0');
            const minutes = String(startDate.getMinutes()).padStart(2, '0');
            setStartTime(`${hours}:${minutes}`);
          }
        }
        
        if (eventData.end_time && !eventData.is_all_day) {
          const endDate = new Date(eventData.end_time);
          const hours = String(endDate.getHours()).padStart(2, '0');
          const minutes = String(endDate.getMinutes()).padStart(2, '0');
          setEndTime(`${hours}:${minutes}`);
        }
        
        setIsAllDay(eventData.is_all_day || false);
        setLocation(eventData.location || '');
        setLocationTitle(eventData.location_title || '');
        setLocationType(eventData.location_type || 'manual');
        setMapsUrl(eventData.maps_url || '');
        
        // Handle customization
        if (eventData.customization) {
          setCustomization({
            ...initialCustomization,
            ...eventData.customization
          });
        }
        
        // Handle invitations
        if (eventData.invitations) {
          const mappedRecipients: InvitationRecipient[] = eventData.invitations.map(
            (invite: any) => ({
              email: invite.email,
              status: invite.status
            })
          );
          setRecipients(mappedRecipients);
        }
      } catch (error) {
        console.error("Error setting form data:", error);
      }
    }
  }, [eventData]);

  // Form actions
  const handleFormCancel = () => {
    navigate('/dashboard/events');
  };

  // Create or update event
  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Parse dates and times 
      const dateObj = new Date(selectedDate);
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      
      dateObj.setHours(startHours, startMinutes, 0);
      const endDateObj = new Date(dateObj);
      endDateObj.setHours(endHours, endMinutes, 0);

      const eventFormData = {
        title,
        description,
        location,
        location_title: locationTitle,
        startDate: dateObj,
        start_time: dateObj.toISOString(),
        end_time: endDateObj.toISOString(),
        isAllDay,
        is_all_day: isAllDay,
        status: "draft" as EventStatus, // Cast to EventStatus type
        customization,
        location_type: locationType,
        maps_url: mapsUrl,
      };

      if (isEditMode && eventId) {
        // Update existing event
        const updatedEvent = await updateEvent(eventId, eventFormData);
        
        if (updatedEvent) {
          toast({
            title: "Event updated",
            description: "Your event has been updated successfully",
          });
          navigate(`/dashboard/events/view/${eventId}`);
        } else {
          toast({
            title: "Update failed",
            description: "Failed to update the event. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        // Create new event
        const newEvent = await createEvent(eventFormData);
        
        if (newEvent) {
          toast({
            title: "Event created",
            description: "Your new event has been created successfully",
          });
          navigate(`/dashboard/events/view/${newEvent.id}`);
        } else {
          toast({
            title: "Creation failed",
            description: "Failed to create the event. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission error",
        description: "An error occurred while submitting the form",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save draft handler
  const handleSaveDraft = async () => {
    try {
      setIsSubmitting(true);
      
      // Parse dates and times
      const dateObj = new Date(selectedDate);
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      
      dateObj.setHours(startHours, startMinutes, 0);
      const endDateObj = new Date(dateObj);
      endDateObj.setHours(endHours, endMinutes, 0);

      const eventFormData = {
        title: title || 'Draft Event',
        description,
        location,
        location_title: locationTitle,
        startDate: dateObj,
        start_time: dateObj.toISOString(),
        end_time: endDateObj.toISOString(),
        isAllDay,
        is_all_day: isAllDay,
        status: "draft" as EventStatus, // Cast to EventStatus type
        customization,
        location_type: locationType,
        maps_url: mapsUrl,
      };

      if (isEditMode && eventId) {
        // Update existing event as draft
        const updatedEvent = await updateEvent(eventId, eventFormData);
        
        if (updatedEvent) {
          toast({
            title: "Draft saved",
            description: "Your event draft has been saved",
          });
        }
      } else {
        // Create new event as draft
        const newEvent = await createEvent(eventFormData);
        
        if (newEvent && newEvent.id) {
          toast({
            title: "Draft saved",
            description: "Your event draft has been saved",
          });
          // Update URL to the edit mode for the new draft
          navigate(`/dashboard/events/edit/${newEvent.id}`, { replace: true });
        }
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error saving draft",
        description: "Failed to save your draft",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addRecipient = (recipient: InvitationRecipient) => {
    setRecipients([...recipients, recipient]);
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const handleSendEmail = async (email: string) => {
    if (!eventId) return;
    
    try {
      await sendEventInvitation(eventId, email);
      addRecipient({ email, status: 'pending' });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  // Handle browser geolocation API
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      return;
    }
    
    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          
          if (data && data.display_name) {
            setLocation(data.display_name);
          }
        } catch (error) {
          console.error('Error getting location details:', error);
          toast({
            title: "Location error",
            description: "Could not get your location details",
            variant: "destructive",
          });
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsGettingLocation(false);
        toast({
          title: "Location error",
          description: "Could not get your current location",
          variant: "destructive",
        });
      }
    );
  };

  if (isLoading) {
    return <div className="container mx-auto py-8 px-4">Loading event details...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <FormHeader 
        isEdit={isEditMode} 
        isLoading={isSubmitting}
        onCancel={handleFormCancel}
      />
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormTabs
          activeTab={activeTab}
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
          onLocationChange={(location, type, url, title) => {
            setLocation(location);
            if (type) setLocationType(type);
            if (url) setMapsUrl(url);
            if (title) setLocationTitle(title);
          }}
          onStartTimeChange={setStartTime}
          onEndTimeChange={setEndTime}
          onIsAllDayChange={setIsAllDay}
          isAllDay={isAllDay}
          locationType={locationType}
          mapsUrl={mapsUrl}
          getCurrentLocation={getCurrentLocation}
          isGettingLocation={isGettingLocation}
          shareTab={shareTab}
          setShareTab={setShareTab}
          onSendEmail={handleSendEmail}
          handleSaveDraft={handleSaveDraft}
        />
      </form>
    </div>
  );
};

// Helper function for sending invitations
const sendEventInvitation = async (eventId: string, email: string) => {
  try {
    // Import here to avoid circular dependency
    const { sendEventInvitation } = await import('@/services/invitation/invitationService');
    return await sendEventInvitation(eventId, email);
  } catch (error) {
    console.error('Error sending invitation:', error);
    throw error;
  }
};

export default EventCreationForm;
