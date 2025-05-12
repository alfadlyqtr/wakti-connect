
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import FormHeader from './FormHeader';
import FormTabs from './FormTabs';
import { useEventBasics } from '@/hooks/events/useEventBasics';
import { useEventLocation } from '@/hooks/events/useEventLocation';
import { useEventRecipients } from '@/hooks/events/useEventRecipients';
import { EventFormValues } from '@/types/event.types';

interface EventCreationFormProps {
  eventId?: string;
}

const EventCreationForm: React.FC<EventCreationFormProps> = ({ eventId }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!!eventId);
  
  // Initialize form
  const form = useForm<EventFormValues>({
    defaultValues: {
      title: '',
      description: '',
      location: '',
      startDate: new Date(),
      isAllDay: false
    }
  });
  
  // Use custom hooks
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
    setCustomization
  } = useEventBasics();
  
  const {
    location,
    locationTitle,
    handleLocationChange,
    isGettingLocation,
    locationType,
    mapsUrl,
  } = useEventLocation();
  
  const {
    recipients,
    shareTab,
    setShareTab,
    addRecipient,
    removeRecipient,
    handleSendEmail
  } = useEventRecipients();
  
  // Fetch event data if editing
  const { data: eventData, isLoading: isLoadingEvent } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) return null;
      
      const { data, error } = await supabase
        .from('events')
        .select('*, event_invitations(*)')
        .eq('id', eventId)
        .single();
        
      if (error) {
        console.error('Error fetching event:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!eventId,
    onSuccess: (data) => {
      if (!data) return;
      
      // Set form values
      setTitle(data.title || '');
      setDescription(data.description || '');
      setIsAllDay(data.is_all_day || false);
      
      if (data.start_time) {
        const startDate = new Date(data.start_time);
        setSelectedDate(startDate);
        
        if (!data.is_all_day) {
          setStartTime(`${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`);
          
          if (data.end_time) {
            const endDate = new Date(data.end_time);
            setEndTime(`${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`);
          }
        }
      }
      
      // Set location
      if (data.location) {
        handleLocationChange(
          data.location,
          data.location_type as 'manual' | 'google_maps',
          data.maps_url,
          data.location_title
        );
      }
      
      // Set customization
      if (data.customization) {
        setCustomization(data.customization);
      }
      
      // Set recipients from invitations
      if (data.event_invitations && data.event_invitations.length > 0) {
        // Map invitations to recipients
        const eventRecipients = data.event_invitations.map(invitation => ({
          id: invitation.id,
          name: invitation.email || invitation.invited_user_id || '',
          email: invitation.email,
          type: 'email',
          status: invitation.status
        }));
        
        // Add recipients
        eventRecipients.forEach(recipient => addRecipient(recipient));
      }
    }
  });
  
  // Save event function
  const saveEvent = async () => {
    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }
      
      // Prepare start and end times
      let startDateTime = new Date(selectedDate);
      let endDateTime = new Date(selectedDate);
      
      if (!isAllDay) {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        startDateTime.setHours(startHours);
        startDateTime.setMinutes(startMinutes);
        
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        endDateTime.setHours(endHours);
        endDateTime.setMinutes(endMinutes);
      }
      
      // Prepare event data
      const eventData = {
        title,
        description,
        location,
        location_title: locationTitle,
        location_type: locationType,
        maps_url: mapsUrl,
        start_time: startDateTime.toISOString(),
        end_time: isAllDay ? null : endDateTime.toISOString(),
        is_all_day: isAllDay,
        status: 'published',
        user_id: session.user.id,
        customization
      };
      
      // Update or create event
      if (isEditMode && eventId) {
        // Update event
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', eventId);
          
        if (error) throw error;
        
        toast({
          title: 'Event updated',
          description: 'Your event has been updated successfully.',
        });
      } else {
        // Create new event
        const { data, error } = await supabase
          .from('events')
          .insert(eventData)
          .select()
          .single();
          
        if (error) throw error;
        
        // Save event ID for invitations
        const newEventId = data.id;
        
        // Create invitations if recipients exist
        if (recipients.length > 0) {
          const invitations = recipients.map(recipient => ({
            event_id: newEventId,
            email: recipient.email,
            invited_user_id: recipient.userId,
            status: 'pending',
            shared_as_link: false
          }));
          
          const { error: invitationError } = await supabase
            .from('event_invitations')
            .insert(invitations);
            
          if (invitationError) {
            console.error('Error creating invitations:', invitationError);
          }
        }
        
        toast({
          title: 'Event created',
          description: 'Your event has been created successfully.',
        });
      }
      
      // Redirect to events list
      navigate('/dashboard/events');
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save event. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/dashboard/events');
  };
  
  const handleSaveDraft = async () => {
    console.log('Saving draft...');
    toast({
      title: 'Draft saved',
      description: 'Your event draft has been saved.',
    });
  };
  
  // Check if we can safely proceed with form submission
  const isFormValid = title.trim() !== '';
  
  return (
    <div className="container mx-auto p-4">
      <Card>
        <FormHeader 
          isEdit={isEditMode} 
          onCancel={handleCancel}
        />
        
        <CardContent className="p-6">
          {isLoadingEvent ? (
            <div className="text-center p-8">Loading event details...</div>
          ) : (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (isFormValid) saveEvent();
              }}
            >
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
                onSendEmail={handleSendEmail}
                handleSaveDraft={handleSaveDraft}
              />
              
              <div className="mt-8 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className="px-8"
                >
                  {isSubmitting ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventCreationForm;
