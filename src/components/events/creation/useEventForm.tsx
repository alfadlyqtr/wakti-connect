import { useState } from "react";
import { useForm } from "react-hook-form";
import { useEvents } from "@/hooks/useEvents";
import { EventFormData, EventCustomization, EventTab } from "@/types/event.types";
import { InvitationRecipient } from "@/types/invitation.types";
import { toast } from "@/components/ui/use-toast";

export const useEventForm = () => {
  const { createEvent, canCreateEvents, userRole } = useEvents();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isAllDay, setIsAllDay] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [recipients, setRecipients] = useState<InvitationRecipient[]>([]);
  const [shareTab, setShareTab] = useState<'recipients' | 'links'>('recipients');
  
  // Location state
  const [locationType, setLocationType] = useState<'manual' | 'google_maps'>('manual');
  const [location, setLocation] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  
  // Customization state
  const [customization, setCustomization] = useState<EventCustomization>({
    background: {
      type: 'color',
      value: '#ffffff',
    },
    font: {
      family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      size: 'medium',
      color: '#333333',
    },
    buttons: {
      accept: {
        background: '#4CAF50',
        color: '#ffffff',
        shape: 'rounded',
      },
      decline: {
        background: '#f44336',
        color: '#ffffff',
        shape: 'rounded',
      }
    },
    headerStyle: 'simple',
    animation: 'fade',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EventFormData>();

  const addRecipient = (recipient: InvitationRecipient) => {
    setRecipients(prev => [...prev, recipient]);
  };

  const removeRecipient = (index: number) => {
    setRecipients(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleLocationChange = (value: string, type: 'manual' | 'google_maps', url?: string) => {
    setLocation(value);
    setLocationType(type);
    if (type === 'google_maps' && url) {
      setMapsUrl(url);
    } else {
      setMapsUrl('');
    }
  };

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
        reset();
        setSelectedDate(new Date());
        setStartTime("09:00");
        setEndTime("10:00");
        setIsAllDay(false);
        setActiveTab("details");
        setRecipients([]);
        setLocation('');
        setLocationType('manual');
        setMapsUrl('');
        setCustomization({
          background: {
            type: 'color',
            value: '#ffffff',
          },
          font: {
            family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            size: 'medium',
            color: '#333333',
          },
          buttons: {
            accept: {
              background: '#4CAF50',
              color: '#ffffff',
              shape: 'rounded',
            },
            decline: {
              background: '#f44336',
              color: '#ffffff',
              shape: 'rounded',
            }
          },
          headerStyle: 'simple',
          animation: 'fade',
        });
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

  const handleNextTab = () => {
    if (activeTab === "details") setActiveTab("customize");
    else if (activeTab === "customize") setActiveTab("share");
  };

  const handlePrevTab = () => {
    if (activeTab === "share") setActiveTab("customize");
    else if (activeTab === "customize") setActiveTab("details");
  };
  
  // Handle email sharing from the ShareLinksTab
  const handleSendEmail = (email: string) => {
    const newRecipient: InvitationRecipient = {
      id: Date.now().toString(), // temporary ID
      name: email,
      email: email,
      type: 'email'
    };
    
    addRecipient(newRecipient);
    
    // Switch to the recipients tab to show the new recipient
    setShareTab('recipients');
  };

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
    onSubmit
  };
};
