
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, EventFormValues, EventFormTab, EventStatus } from "@/types/event.types";
import FormHeader from "./creation/FormHeader";
import FormTabs from "./creation/FormTabs";
import FormActions from "./creation/FormActions";
import { InvitationRecipient } from "@/types/invitation.types";
import useEditEventEffect from "@/hooks/events/hooks/useEditEventEffect";
import { Event, EventCustomization } from "@/types/event.types";
import { useEventSubmission } from "@/hooks/events/useEventSubmission";
import { ShareTab, SHARE_TABS } from "@/types/form.types";
import { useEventLocation } from "@/hooks/events/useEventLocation";
import { toast } from "@/components/ui/use-toast";
import { defaultCustomization } from "@/hooks/useEventCustomization";

interface EventCreationFormProps {
  editEvent?: Event | null;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const EventCreationForm: React.FC<EventCreationFormProps> = ({ 
  editEvent, 
  onCancel, 
  onSuccess 
}) => {
  const [activeTab, setActiveTab] = useState<EventFormTab>("details");
  const [recipients, setRecipients] = useState<InvitationRecipient[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [shareTab, setShareTab] = useState<ShareTab>(SHARE_TABS.RECIPIENTS);
  const [customization, setCustomization] = useState<EventCustomization>(defaultCustomization);
  
  // Use enhanced location hook for advanced location features
  const {
    location,
    locationTitle,
    locationType,
    mapsUrl,
    isGettingLocation,
    handleLocationChange,
    getCurrentLocation
  } = useEventLocation();
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      location_title: "",
      startDate: selectedDate,
      endDate: undefined,
      isAllDay: false,
    }
  });
  
  // Use the hook to load event data if in edit mode
  const { isLoading: isLoadingEvent } = useEditEventEffect({
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
    setLocationType: (type) => handleLocationChange(location, type),
    setMapsUrl: (url) => handleLocationChange(location, locationType, url),
    setLocationTitle: (title) => handleLocationChange(location, locationType, mapsUrl, title),
    setCustomization: (newCustomization: EventCustomization) => setCustomization(newCustomization)
  });

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    form.setValue("title", newTitle);
  };

  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription);
    form.setValue("description", newDescription);
  };

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    form.setValue("startDate", newDate);
  };
  
  const handleAdvancedLocationChange = (
    location: string,
    type?: 'manual' | 'google_maps', 
    url?: string,
    title?: string
  ) => {
    handleLocationChange(location, type, url, title);
    form.setValue("location", location);
    form.setValue("location_title", title || "");
  };

  // Handler for sending email invitations
  const handleSendEmail = (email: string) => {
    const emailRecipient: InvitationRecipient = {
      id: `email-${Date.now()}`,
      name: email,
      email,
      type: 'email'
    };
    
    setRecipients(prev => [...prev, emailRecipient]);
    setShareTab(SHARE_TABS.RECIPIENTS);
  };

  // The submission hook from useEventSubmission
  const {
    isSubmitting,
    onSubmit
  } = useEventSubmission({
    title,
    description,
    isAllDay,
    selectedDate,
    startTime,
    endTime,
    location,
    locationTitle,
    locationType,
    mapsUrl,
    customization,
    recipients,
    resetForm: () => {
      setTitle("");
      setDescription("");
      setSelectedDate(new Date());
      setIsAllDay(false);
      setStartTime("09:00");
      setEndTime("10:00");
      handleLocationChange("", undefined);
      setRecipients([]);
      setActiveTab("details");
      setCustomization(defaultCustomization);
      form.reset();
    },
    editEvent,
    onSuccess
  });
  
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    form.setValue("location", location);
    form.setValue("location_title", locationTitle || "");
    form.setValue("isAllDay", isAllDay);
    const formData = form.getValues();
    onSubmit(formData);
  };
  
  const handlePrev = () => {
    if (activeTab === "customize") setActiveTab("details");
    if (activeTab === "share") setActiveTab("customize");
  };

  const handleNext = () => {
    if (activeTab === "details") setActiveTab("customize");
    if (activeTab === "customize") setActiveTab("share");
  };

  // Handle save as draft functionality
  const handleSaveDraft = () => {
    // Use the same submission but explicitly set status to draft
    form.setValue("location", location);
    form.setValue("location_title", locationTitle || "");
    form.setValue("isAllDay", isAllDay);
    
    const formData = form.getValues();
    const draftData = {
      ...formData,
      status: 'draft' as EventStatus
    };
    
    return onSubmit(draftData);
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <FormHeader 
        isEdit={isEditMode} 
        onCancel={onCancel}
      />
      
      <form onSubmit={handleSubmitForm}>
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
          onCustomizationChange={(newCustomization) => setCustomization(newCustomization)}
          recipients={recipients}
          addRecipient={(recipient) => setRecipients(prev => [...prev, recipient])}
          removeRecipient={(index) => {
            const newRecipients = [...recipients];
            newRecipients.splice(index, 1);
            setRecipients(newRecipients);
          }}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          onDateChange={handleDateChange}
          onLocationChange={handleAdvancedLocationChange}
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
        
        <FormActions 
          onPrev={handlePrev}
          onNext={handleNext}
          isSubmitting={isSubmitting}
          showSubmit={activeTab === "share"}
          submitLabel={isEditMode ? "Update Event" : "Create Event"}
          activeTab={activeTab}
          isEditMode={isEditMode}
        />
      </form>
    </div>
  );
};

export default EventCreationForm;
