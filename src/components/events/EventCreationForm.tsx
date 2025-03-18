
import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEventForm } from "@/hooks/useEventForm";
import DetailsTab from "./creation/DetailsTab";
import ShareTab from "./creation/ShareTab";
import CustomizeTab from "./customize/CustomizeTab";
import UpgradeCard from "./creation/UpgradeCard";
import { Event } from "@/types/event.types";
import { Button } from "@/components/ui/button";

interface EventCreationFormProps {
  editEvent?: Event | null;
  onCancel?: () => void;
}

const EventCreationForm: React.FC<EventCreationFormProps> = ({ 
  editEvent = null,
  onCancel
}) => {
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
  } = useEventForm();

  // Initialize form with editEvent data if provided
  useEffect(() => {
    if (editEvent) {
      // Set basic fields
      setTitle(editEvent.title);
      setDescription(editEvent.description || '');
      setValue('title', editEvent.title);
      setValue('description', editEvent.description || '');
      
      // Set date and time
      const startDate = new Date(editEvent.start_time);
      const endDate = new Date(editEvent.end_time);
      setSelectedDate(startDate);
      setIsAllDay(editEvent.is_all_day);
      
      if (!editEvent.is_all_day) {
        const formatTimeString = (date: Date) => {
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        };
        
        setStartTime(formatTimeString(startDate));
        setEndTime(formatTimeString(endDate));
      }
      
      // Set location
      if (editEvent.location) {
        handleLocationChange(
          editEvent.location, 
          editEvent.location_type || 'manual', 
          editEvent.maps_url
        );
      }
      
      // Set customization
      if (editEvent.customization) {
        setCustomization(editEvent.customization);
      }
      
      // Set invitees if any
      if (editEvent.invitations && editEvent.invitations.length > 0) {
        editEvent.invitations.forEach(invitation => {
          if (invitation.email) {
            addRecipient({
              id: invitation.id,
              name: invitation.email,
              email: invitation.email,
              type: 'email'
            });
          } else if (invitation.invited_user_id) {
            // In a real app, you'd fetch the user's details
            addRecipient({
              id: invitation.id,
              name: `User ${invitation.invited_user_id.substring(0, 5)}...`,
              type: 'contact'
            });
          }
        });
      }
    }
  }, [editEvent, setTitle, setDescription, setValue, setSelectedDate, setIsAllDay, setStartTime, setEndTime, handleLocationChange, setCustomization, addRecipient]);

  // If user can't create events, show upgrade message
  if (!canCreateEvents) {
    return <UpgradeCard />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{editEvent ? 'Edit Event' : 'Create Event'}</CardTitle>
          {onCancel && (
            <Button variant="ghost" type="button" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4 w-full max-w-md mx-auto">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <DetailsTab 
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
              title={title}
              description={description}
              setTitle={setTitle}
              setDescription={setDescription}
              isEdit={!!editEvent}
            />
          </TabsContent>
          
          <TabsContent value="customize">
            <CustomizeTab
              customization={customization}
              onCustomizationChange={setCustomization}
              title={title}
              description={description}
              location={location}
              selectedDate={selectedDate}
              startTime={startTime}
              endTime={endTime}
            />
            
            <div className="px-6 py-4 flex justify-between">
              <button 
                type="button" 
                className="px-4 py-2 border rounded-md" 
                onClick={handlePrevTab}
              >
                Back
              </button>
              <button 
                type="button" 
                className="px-4 py-2 bg-primary text-white rounded-md" 
                onClick={handleNextTab}
              >
                Next: Share
              </button>
            </div>
          </TabsContent>
          
          <TabsContent value="share">
            <ShareTab 
              shareTab={shareTab}
              setShareTab={setShareTab}
              recipients={recipients}
              addRecipient={addRecipient}
              removeRecipient={removeRecipient}
              handleSendEmail={handleSendEmail}
              handlePrevTab={handlePrevTab}
              isSubmitting={isSubmitting}
              isEdit={!!editEvent}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </form>
  );
};

export default EventCreationForm;
