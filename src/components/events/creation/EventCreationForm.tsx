import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { EventFormTab, EventFormData, EventCustomization } from '@/types/event.types';
import DetailsTab from './DetailsTab';
import CustomizeTab from './CustomizeTab';
import ShareLinksTab from './ShareLinksTab';
import { initialCustomization } from '../customize/initial-customization';
import { useMutation } from '@tanstack/react-query';
import { createEvent, updateEvent } from '@/services/event/eventService';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { eventSchema } from '@/types/event.types';
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import LocationInput from '../location/LocationInput';
import { Switch } from '@/components/ui/switch';
import { TimePicker } from '@/components/ui/time-picker';
import { Calendar } from 'lucide-react';
import { createInvitation } from '@/services/invitation/invitationService';

interface EventCreationFormProps {
  isEdit?: boolean;
  eventData?: any;
}

const EventCreationForm: React.FC<EventCreationFormProps> = ({ isEdit = false, eventData }) => {
  const [activeTab, setActiveTab] = useState<EventFormTab>('details');
  const [title, setTitle] = useState(eventData?.title || '');
  const [description, setDescription] = useState(eventData?.description || '');
  const [selectedDate, setSelectedDate] = useState(eventData?.start_time ? new Date(eventData.start_time) : new Date());
  const [location, setLocation] = useState(eventData?.location || '');
  const [locationTitle, setLocationTitle] = useState(eventData?.location_title || '');
  const [startTime, setStartTime] = useState(eventData?.start_time ? eventData.start_time.substring(11, 16) : '12:00');
  const [endTime, setEndTime] = useState(eventData?.end_time ? eventData.end_time.substring(11, 16) : '13:00');
  const [isAllDay, setIsAllDay] = useState(eventData?.is_all_day || false);
  const [customization, setCustomization] = useState<EventCustomization>(eventData?.customization || initialCustomization);
  const [locationType, setLocationType] = useState<"manual" | "google_maps">(eventData?.location_type || "manual");
  const [mapsUrl, setMapsUrl] = useState(eventData?.maps_url || "");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { eventId } = useParams<{ eventId: string }>();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      location_title: '',
      startDate: new Date(),
      endDate: new Date(),
      isAllDay: false
    },
    mode: "onChange"
  });

  const mutation = useMutation({
    mutationFn: isEdit ? updateEvent : createEvent,
    onSuccess: (data) => {
      toast({
        title: isEdit ? "Event updated successfully!" : "Event created successfully!",
        description: isEdit
          ? "Your event details have been updated."
          : "Your event has been created and is ready to share.",
      });
      navigate('/dashboard/events');
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "Failed to save the event. Please try again.",
      });
    },
  });

  const handleCreate = async () => {
    try {
      const data = {
        title,
        description,
        location,
        location_title: locationTitle,
        start_time: selectedDate,
        end_time: selectedDate,
        is_all_day: isAllDay,
        customization,
        location_type: locationType,
        maps_url: mapsUrl,
      };

      if (isEdit && eventId) {
        await mutation.mutateAsync({ ...data, id: eventId });
      } else {
        await mutation.mutateAsync(data);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: error.message || "Could not create event",
      });
    }
  };

  const handleSaveDraft = async () => {
    try {
      const data = {
        title,
        description,
        location,
        location_title: locationTitle,
        start_time: selectedDate,
        end_time: selectedDate,
        is_all_day: isAllDay,
        customization,
        status: 'draft',
        location_type: locationType,
        maps_url: mapsUrl,
      };

      if (isEdit && eventId) {
        await mutation.mutateAsync({ ...data, id: eventId });
      } else {
        await mutation.mutateAsync(data);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: error.message || "Could not save event as draft",
      });
    }
  };

  const handleLocationChange = useCallback(
    (location: string, type: "manual" | "google_maps" = "manual", url = "", title = "") => {
      setLocation(location);
      setLocationType(type);
      setMapsUrl(url);
      setLocationTitle(title);
    },
    []
  );

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsGettingLocation(false);
          toast({
            variant: "destructive",
            title: "Error!",
            description: "Could not retrieve current location.",
          });
        }
      );
    } else {
      setIsGettingLocation(false);
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Geolocation is not supported by this browser.",
      });
    }
  };

  const handleSendInvitationEmail = async (email: string) => {
    if (!eventData?.id) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Event ID is missing. Please save the event first.",
      });
      return;
    }

    try {
      await createInvitation({
        event_id: eventData.id,
        email: email,
        shared_as_link: true
      });

      toast({
        title: "Invitation sent!",
        description: `An invitation email has been sent to ${email}`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "Failed to send invitation. Please try again.",
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex justify-center mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="share">Share</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="outline-none">
          <DetailsTab
            selectedDate={selectedDate}
            startTime={startTime}
            endTime={endTime}
            isAllDay={isAllDay}
            title={title}
            description={description}
            location={location}
            locationTitle={locationTitle}
            locationType={locationType}
            mapsUrl={mapsUrl}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onDateChange={setSelectedDate}
            onStartTimeChange={setStartTime}
            onEndTimeChange={setEndTime}
            onIsAllDayChange={setIsAllDay}
            onLocationChange={handleLocationChange}
            handleNextTab={() => setActiveTab('customize')}
            getCurrentLocation={getCurrentLocation}
            isGettingLocation={isGettingLocation}
            errors={errors}
            formData={formData}
            setFormData={setFormData}
          />
        </TabsContent>
        <TabsContent value="customize" className="outline-none">
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
        </TabsContent>
        <TabsContent value="share" className="outline-none">
          <ShareLinksTab
            eventUrl={eventData ? window.location.origin + `/i/${eventData.id}` : undefined}
            onSendEmail={handleSendInvitationEmail}
            eventId={eventData?.id}
            shareLink={eventData ? window.location.origin + `/i/${eventData.id}` : undefined}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={handleSaveDraft}>
          Save Draft
        </Button>
        <Button type="button" onClick={handleCreate} disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Publish Event"}
        </Button>
      </div>
    </div>
  );
};

export default EventCreationForm;
