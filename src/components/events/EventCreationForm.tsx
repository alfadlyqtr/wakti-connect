
import React from "react";
import { Card } from "@/components/ui/card";
import { useEventForm } from "@/hooks/useEventForm";
import UpgradeCard from "./creation/UpgradeCard";
import { Event } from "@/types/event.types";
import FormHeader from "./creation/FormHeader";
import FormTabs from "./creation/FormTabs";
import { useEditEventEffect } from "./hooks/useEditEventEffect";
import { EventFormTab, ShareTab } from "@/types/form.types";
import { useIsMobile } from "@/hooks/use-mobile";

interface EventCreationFormProps {
  editEvent?: Event | null;
  onCancel?: () => void;
  onSuccess?: () => void; // New callback for success handling
}

const EventCreationForm: React.FC<EventCreationFormProps> = ({ 
  editEvent = null,
  onCancel,
  onSuccess
}) => {
  const isMobile = useIsMobile();
  
  const {
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
    addRecipient,
    removeRecipient,
    handleLocationChange,
    handleNextTab,
    handlePrevTab,
    handleSendEmail,
    onSubmit,
    setValue,
    title,
    description,
    setTitle,
    setDescription
  } = useEventForm(editEvent, onSuccess);

  // Use our custom hook for initializing the form with edit data
  useEditEventEffect({
    editEvent,
    setTitle,
    setDescription,
    setValue,
    setSelectedDate,
    setIsAllDay,
    setStartTime,
    setEndTime,
    handleLocationChange,
    setCustomization,
    addRecipient
  });

  // If user can't create events, show upgrade message
  if (!canCreateEvents) {
    return <UpgradeCard />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full overflow-hidden">
        <FormHeader isEdit={!!editEvent} onCancel={onCancel} />
        
        <div className={isMobile ? "px-2 py-2" : "px-4 py-4"}>
          <FormTabs
            activeTab={activeTab as EventFormTab}
            setActiveTab={setActiveTab}
            register={register}
            errors={errors}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            isAllDay={isAllDay}
            setIsAllDay={setIsAllDay}
            location={location}
            locationType={locationType}
            mapsUrl={mapsUrl}
            handleLocationChange={handleLocationChange}
            handleNextTab={handleNextTab}
            handlePrevTab={handlePrevTab}
            customization={customization}
            setCustomization={setCustomization}
            shareTab={shareTab as ShareTab}
            setShareTab={setShareTab}
            recipients={recipients}
            addRecipient={addRecipient}
            removeRecipient={removeRecipient}
            handleSendEmail={handleSendEmail}
            isSubmitting={isSubmitting}
            title={title}
            description={description}
            setTitle={setTitle}
            setDescription={setDescription}
            isEdit={!!editEvent}
          />
        </div>
      </Card>
    </form>
  );
};

export default EventCreationForm;
