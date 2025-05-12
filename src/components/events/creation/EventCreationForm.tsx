
// Import existing code and add the prepareEventForStorage import
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventFormTab, EventCustomization } from '@/types/event.types';
import DetailsTab from './DetailsTab';
import ShareLinksTab from './ShareLinksTab';
import CustomizeTab from '../customize/CustomizeTab';
import { supabase } from '@/integrations/supabase/client';
import { transformDatabaseEvent, prepareEventForStorage } from '@/services/event/eventHelpers';

// Default customization settings
const defaultCustomization: EventCustomization = {
  background: {
    type: 'solid',
    value: '#ffffff'
  },
  font: {
    family: 'system-ui, sans-serif',
    size: 'medium',
    color: '#333333',
    alignment: 'left'
  },
  buttons: {
    accept: {
      background: '#4CAF50',
      color: '#ffffff',
      shape: 'rounded'
    },
    decline: {
      background: '#f44336',
      color: '#ffffff',
      shape: 'rounded'
    }
  }
};

// Interface for form data
interface FormData {
  title: string;
  description: string;
  location: string;
  locationTitle: string;
  locationType: 'manual' | 'google_maps';
  mapsUrl: string;
  selectedDate: Date | undefined;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
}

const EventCreationForm: React.FC<{ eventId?: string }> = ({ eventId }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<EventFormTab>('details');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    location: '',
    locationTitle: '',
    locationType: 'manual',
    mapsUrl: '',
    selectedDate: undefined,
    startTime: '12:00',
    endTime: '13:00',
    isAllDay: false
  });
  const [customization, setCustomization] = useState<EventCustomization>(defaultCustomization);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch event data if editing
  const { data: eventData, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) return null;
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      
      if (error) throw error;
      return transformDatabaseEvent(data);
    },
    enabled: !!eventId
  });
  
  // Populate form data when editing an existing event
  useEffect(() => {
    if (eventData) {
      try {
        const startDate = new Date(eventData.start_time);
        setFormData({
          title: eventData.title || '',
          description: eventData.description || '',
          location: eventData.location || '',
          locationTitle: eventData.location_title || '',
          locationType: (eventData.location_type as 'manual' | 'google_maps') || 'manual',
          mapsUrl: eventData.maps_url || '',
          selectedDate: startDate,
          startTime: format(startDate, 'HH:mm'),
          endTime: eventData.end_time ? format(new Date(eventData.end_time), 'HH:mm') : '13:00',
          isAllDay: eventData.is_all_day || false
        });
        
        if (eventData.customization) {
          setCustomization(eventData.customization);
        }
      } catch (error) {
        console.error("Error parsing event data:", error);
      }
    }
  }, [eventData]);
  
  const handleNextTab = () => {
    if (activeTab === 'details') {
      setActiveTab('customize');
    } else if (activeTab === 'customize') {
      setActiveTab('share');
    }
  };
  
  const handlePrevTab = () => {
    if (activeTab === 'customize') {
      setActiveTab('details');
    } else if (activeTab === 'share') {
      setActiveTab('customize');
    }
  };
  
  const handleSaveDraft = async () => {
    if (!formData.title) {
      toast({
        title: "Title Required",
        description: "Please add a title for your event",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to create events");
      }
      
      // Create start and end date from form data
      const startDate = formData.selectedDate 
        ? new Date(formData.selectedDate.setHours(
            parseInt(formData.startTime.split(':')[0]),
            parseInt(formData.startTime.split(':')[1])
          )).toISOString()
        : new Date().toISOString();
      
      let endDate: string;
      if (formData.isAllDay) {
        // For all day events, set end time to end of day
        const endOfDay = formData.selectedDate 
          ? new Date(formData.selectedDate.setHours(23, 59, 59)) 
          : new Date(new Date().setHours(23, 59, 59));
        endDate = endOfDay.toISOString();
      } else {
        endDate = formData.selectedDate 
          ? new Date(formData.selectedDate.setHours(
              parseInt(formData.endTime.split(':')[0]),
              parseInt(formData.endTime.split(':')[1])
            )).toISOString()
          : new Date().toISOString();
      }
      
      const eventData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        location_title: formData.locationTitle,
        location_type: formData.locationType,
        maps_url: formData.mapsUrl,
        start_time: startDate,
        end_time: endDate,
        is_all_day: formData.isAllDay,
        status: 'draft',
        user_id: session.user.id,
        customization: customization
      };
      
      // Prepare for database storage by stringifying customization
      const dbEventData = prepareEventForStorage(eventData);
      
      let result;
      
      if (eventId) {
        // Update existing event
        result = await supabase
          .from('events')
          .update(dbEventData)
          .eq('id', eventId);
      } else {
        // Create new event
        result = await supabase
          .from('events')
          .insert([dbEventData]);
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: "Draft Saved",
        description: `Your event "${formData.title}" has been saved as a draft`,
      });
      
      if (!eventId) {
        navigate('/dashboard/events');
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your event draft",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePublish = async () => {
    if (!formData.title || !formData.selectedDate) {
      toast({
        title: "Missing Information",
        description: "Please add a title and date for your event",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to create events");
      }
      
      // Create start and end date from form data
      const startDate = new Date(formData.selectedDate.setHours(
        parseInt(formData.startTime.split(':')[0]),
        parseInt(formData.startTime.split(':')[1])
      )).toISOString();
      
      let endDate: string;
      if (formData.isAllDay) {
        // For all day events, set end time to end of day
        const endOfDay = new Date(formData.selectedDate.setHours(23, 59, 59));
        endDate = endOfDay.toISOString();
      } else {
        endDate = new Date(formData.selectedDate.setHours(
          parseInt(formData.endTime.split(':')[0]),
          parseInt(formData.endTime.split(':')[1])
        )).toISOString();
      }
      
      const eventData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        location_title: formData.locationTitle,
        location_type: formData.locationType,
        maps_url: formData.mapsUrl,
        start_time: startDate,
        end_time: endDate,
        is_all_day: formData.isAllDay,
        status: 'published',
        user_id: session.user.id,
        customization: customization
      };
      
      // Prepare for database storage by stringifying customization
      const dbEventData = prepareEventForStorage(eventData);
      
      let result;
      let newEventId = eventId;
      
      if (eventId) {
        // Update existing event
        result = await supabase
          .from('events')
          .update(dbEventData)
          .eq('id', eventId);
      } else {
        // Create new event
        result = await supabase
          .from('events')
          .insert([dbEventData])
          .select('id');
          
        if (result.data && result.data[0]) {
          newEventId = result.data[0].id;
        }
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: "Event Published",
        description: `Your event "${formData.title}" has been published`,
      });
      
      navigate('/dashboard/events');
    } catch (error) {
      console.error("Error publishing event:", error);
      toast({
        title: "Publish Failed",
        description: "There was an error publishing your event",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSendEmail = async (email: string) => {
    try {
      // Logic to send email invitations would go here
      toast({
        title: "Invitation Sent",
        description: `An invitation has been sent to ${email}`,
      });
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading && eventId) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading event...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as EventFormTab)}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {eventId ? 'Edit Event' : 'Create New Event'}
          </h1>
          
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="details">
          <DetailsTab
            formData={formData}
            setFormData={setFormData}
            handleNextTab={handleNextTab}
            handleSaveDraft={handleSaveDraft}
            isSubmitting={isSubmitting}
          />
        </TabsContent>
        
        <TabsContent value="customize">
          <CustomizeTab
            customization={customization}
            onCustomizationChange={setCustomization}
            handleNextTab={handleNextTab}
            handleSaveDraft={handleSaveDraft}
            location={formData.location}
            locationTitle={formData.locationTitle}
            title={formData.title}
            description={formData.description}
            selectedDate={formData.selectedDate}
          />
        </TabsContent>
        
        <TabsContent value="share">
          <div className="space-y-6">
            <ShareLinksTab
              eventId={eventId}
              shareLink={`${window.location.origin}/events/share/${eventId || 'new'}`}
              onSendEmail={handleSendEmail}
            />
            
            <div className="flex justify-end gap-2 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevTab}
              >
                Back
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
              >
                Save Draft
              </Button>
              
              <Button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting}
              >
                Publish Event
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventCreationForm;
