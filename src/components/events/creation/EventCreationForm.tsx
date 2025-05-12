
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventFormTab, EventFormValues, eventSchema } from '@/types/event.types';
import { useIsMobile } from '@/hooks/use-mobile';
import DetailsTab from './DetailsTab';
import CustomizeTab from './CustomizeTab';
import ShareLinksTab from './ShareLinksTab';
import FormHeader from './FormHeader';
import initialCustomization from '../customize/initial-customization';
import { useEventBasics } from '@/hooks/events/useEventBasics';
import { createEvent, getEventById, updateEvent } from '@/services/event/eventService';
import { useToast } from '@/components/ui/use-toast';
import { useEventRecipients } from '@/hooks/events/useEventRecipients';
import { InvitationRecipient } from '@/types/invitation.types';
import { sendEventInvitation } from '@/services/invitation/invitationService';

// Types and interfaces
interface FormData {
  title: string;
  description: string;
  location: string;
  location_title: string;
  startDate: Date;
  endDate?: Date;
  isAllDay: boolean;
}

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
  const isMobile = useIsMobile();
  const params = useParams<{ eventId: string }>();
  
  // Use the eventId from params if provided
  const effectiveEventId = eventId || params.eventId;
  const isEdit = Boolean(effectiveEventId);
  
  // Event form state management
  const form = useForm<FormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      location_title: '',
      startDate: new Date(),
      isAllDay: false
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    location: '',
    location_title: '',
    startDate: new Date(),
    isAllDay: false
  });
  
  // Event core state
  const {
    title, setTitle,
    description, setDescription,
    isAllDay, setIsAllDay,
    selectedDate, setSelectedDate,
    startTime, setStartTime,
    endTime, setEndTime,
    customization, setCustomization,
    activeTab, setActiveTab,
  } = useEventBasics();
  
  // Event location state
  const [location, setLocation] = useState('');
  const [locationTitle, setLocationTitle] = useState('');
  const [locationType, setLocationType] = useState<'manual' | 'google_maps'>('manual');
  const [mapsUrl, setMapsUrl] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  // Recipients state for sharing tab
  const {
    recipients,
    shareTab,
    setShareTab,
    addRecipient,
    removeRecipient,
    handleSendEmail
  } = useEventRecipients();
  
  // Load event data for editing
  useEffect(() => {
    if (!effectiveEventId) return;
    
    const loadEventData = async () => {
      setIsLoading(true);
      try {
        const eventData = await getEventById(effectiveEventId);
        
        if (eventData) {
          // Update form fields
          setTitle(eventData.title || '');
          setDescription(eventData.description || '');
          setLocation(eventData.location || '');
          setLocationTitle(eventData.location_title || '');
          
          // Update date and time
          if (eventData.start_time) {
            const startDate = new Date(eventData.start_time);
            setSelectedDate(startDate);
          }
          
          // Set customization if available
          if (eventData.customization) {
            setCustomization(eventData.customization);
          }
          
          // Set location type and maps URL if available
          if (eventData.location_type) {
            setLocationType(eventData.location_type as 'manual' | 'google_maps');
          }
          
          if (eventData.maps_url) {
            setMapsUrl(eventData.maps_url);
          }
          
          setIsAllDay(eventData.is_all_day || false);
          
          // Update form data
          setFormData({
            title: eventData.title || '',
            description: eventData.description || '',
            location: eventData.location || '',
            location_title: eventData.location_title || '',
            startDate: eventData.start_time ? new Date(eventData.start_time) : new Date(),
            isAllDay: eventData.is_all_day || false
          });
        } else {
          toast({
            title: "Event not found",
            description: "The event you're trying to edit could not be found",
            variant: "destructive"
          });
          navigate('/dashboard/events');
        }
      } catch (error) {
        console.error("Error loading event:", error);
        toast({
          title: "Error",
          description: "Failed to load event data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEventData();
  }, [effectiveEventId]);
  
  // Handle saving as draft
  const handleSaveDraft = async () => {
    try {
      setIsSubmitting(true);
      
      // Get the values from form and state
      const startTimeDate = new Date(selectedDate);
      const endTimeDate = new Date(selectedDate);
      
      if (!isAllDay) {
        // Parse start and end times
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        
        startTimeDate.setHours(startHour, startMinute, 0);
        endTimeDate.setHours(endHour, endMinute, 0);
      } else {
        startTimeDate.setHours(0, 0, 0);
        endTimeDate.setHours(23, 59, 59);
      }
      
      const eventData = {
        title,
        description,
        location,
        location_title: locationTitle,
        startDate: selectedDate,
        start_time: startTimeDate.toISOString(),
        end_time: endTimeDate.toISOString(),
        isAllDay,
        is_all_day: isAllDay,
        status: 'draft',
        customization,
        location_type: locationType,
        maps_url: mapsUrl
      };
      
      if (isEdit && effectiveEventId) {
        await updateEvent(effectiveEventId, eventData);
        toast({
          title: "Draft saved",
          description: "Your event has been saved as a draft",
        });
      } else {
        const result = await createEvent(eventData);
        
        if (result) {
          toast({
            title: "Draft saved",
            description: "Your event has been saved as a draft",
          });
          
          if (onSuccess) {
            onSuccess();
          } else {
            navigate(`/dashboard/events/edit/${result.id}`);
          }
        }
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Get the values from form and state
      const startTimeDate = new Date(selectedDate);
      const endTimeDate = new Date(selectedDate);
      
      if (!isAllDay) {
        // Parse start and end times
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        
        startTimeDate.setHours(startHour, startMinute, 0);
        endTimeDate.setHours(endHour, endMinute, 0);
      } else {
        startTimeDate.setHours(0, 0, 0);
        endTimeDate.setHours(23, 59, 59);
      }
      
      const eventData = {
        title,
        description,
        location,
        location_title: locationTitle,
        startDate: selectedDate,
        start_time: startTimeDate.toISOString(),
        end_time: endTimeDate.toISOString(),
        isAllDay,
        is_all_day: isAllDay,
        status: 'published',
        customization,
        location_type: locationType,
        maps_url: mapsUrl
      };
      
      if (isEdit && effectiveEventId) {
        await updateEvent(effectiveEventId, eventData);
        toast({
          title: "Event updated",
          description: "Your event has been updated",
        });
        
        // Send invitations for recipients if any
        if (recipients.length > 0) {
          for (const recipient of recipients) {
            if (recipient.email) {
              await sendEventInvitation(effectiveEventId, recipient.email);
            }
          }
        }
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(`/dashboard/events/view/${effectiveEventId}`);
        }
      } else {
        const result = await createEvent(eventData);
        
        if (result) {
          toast({
            title: "Event created",
            description: "Your event has been created",
          });
          
          // Send invitations for recipients if any
          if (recipients.length > 0) {
            for (const recipient of recipients) {
              if (recipient.email) {
                await sendEventInvitation(result.id, recipient.email);
              }
            }
          }
          
          if (onSuccess) {
            onSuccess();
          } else {
            navigate(`/dashboard/events/view/${result.id}`);
          }
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle location change
  const handleLocationChange = (
    newLocation: string, 
    newLocationType: 'manual' | 'google_maps' = 'manual', 
    newMapsUrl: string = '', 
    newLocationTitle: string = ''
  ) => {
    setLocation(newLocation);
    setLocationType(newLocationType);
    setMapsUrl(newMapsUrl);
    setLocationTitle(newLocationTitle);
  };
  
  // Handle current location detection
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      return;
    }
    
    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // TODO: Add reverse geocoding to get location name
          const locationText = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          
          handleLocationChange(
            locationText, 
            'google_maps', 
            `https://www.google.com/maps?q=${latitude},${longitude}`, 
            'My Current Location'
          );
        } catch (error) {
          console.error("Error getting location:", error);
          toast({
            title: "Error",
            description: "Failed to get your current location",
            variant: "destructive"
          });
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to get your current location",
          variant: "destructive"
        });
        setIsGettingLocation(false);
      }
    );
  };
  
  // Generate a unique event link
  const generateShareLink = () => {
    if (!effectiveEventId) return '';
    
    return `${window.location.origin}/events/${effectiveEventId}`;
  };
  
  // Email send handler for share tab
  const handleSendEventEmail = async (email: string) => {
    if (!effectiveEventId) {
      toast({
        title: "Error",
        description: "You need to save the event before sharing",
        variant: "destructive"
      });
      return;
    }
    
    await sendEventInvitation(effectiveEventId, email);
  };
  
  // Handle tab navigation
  const handleTabChange = (tab: EventFormTab) => {
    setActiveTab(tab);
  };
  
  // Render the active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'details':
        return (
          <DetailsTab
            selectedDate={selectedDate}
            startTime={startTime}
            endTime={endTime}
            isAllDay={isAllDay}
            location={location}
            locationTitle={locationTitle}
            locationType={locationType}
            mapsUrl={mapsUrl}
            handleNextTab={() => setActiveTab('customize')}
            title={title}
            description={description}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onDateChange={setSelectedDate}
            onLocationChange={handleLocationChange}
            onStartTimeChange={setStartTime}
            onEndTimeChange={setEndTime}
            onIsAllDayChange={setIsAllDay}
            getCurrentLocation={getCurrentLocation}
            isGettingLocation={isGettingLocation}
            isEdit={isEdit}
          />
        );
      case 'customize':
        return (
          <CustomizeTab 
            customization={customization}
            onCustomizationChange={setCustomization}
            handleNextTab={() => setActiveTab('share')}
            handleSaveDraft={handleSaveDraft}
            location={location}
            locationTitle={locationTitle}
            title={title}
            description={description}
            selectedDate={selectedDate}
          />
        );
      case 'share':
        return (
          <ShareLinksTab
            eventId={effectiveEventId}
            shareLink={generateShareLink()}
            onSendEmail={handleSendEventEmail}
          />
        );
      default:
        return null;
    }
  };
  
  // Handle cancel action
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/dashboard/events');
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <Card>
        <FormHeader isEdit={isEdit} onCancel={handleCancel} />
        
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div>
              <div className="flex border-b mb-6">
                <button
                  type="button"
                  className={`px-4 py-2 font-medium ${
                    activeTab === "details"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => handleTabChange("details")}
                >
                  Details
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 font-medium ${
                    activeTab === "customize"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => handleTabChange("customize")}
                >
                  Customize
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 font-medium ${
                    activeTab === "share"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => handleTabChange("share")}
                >
                  Share
                </button>
              </div>

              {renderActiveTab()}

              <div className="mt-8 flex justify-between">
                {activeTab !== 'details' && (
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                    onClick={() => {
                      if (activeTab === 'customize') setActiveTab('details');
                      else if (activeTab === 'share') setActiveTab('customize');
                    }}
                  >
                    Back
                  </button>
                )}
                
                <div className="flex-grow"></div>
                
                {activeTab !== 'share' ? (
                  <button
                    type="button"
                    className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition-colors"
                    onClick={() => {
                      if (activeTab === 'details') {
                        if (!title.trim()) {
                          toast({
                            title: "Title required",
                            description: "Please enter a title for your event",
                            variant: "destructive"
                          });
                          return;
                        }
                        setActiveTab('customize');
                      } else if (activeTab === 'customize') {
                        setActiveTab('share');
                      }
                    }}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition-colors"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Publishing...' : isEdit ? 'Update Event' : 'Publish Event'}
                  </button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventCreationForm;
