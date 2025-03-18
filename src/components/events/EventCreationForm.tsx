
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEventForm } from "./creation/useEventForm";
import DetailsTab from "./creation/DetailsTab";
import ShareTab from "./creation/ShareTab";
import CustomizeTab from "./customize/CustomizeTab";
import UpgradeCard from "./creation/UpgradeCard";

const EventCreationForm: React.FC = () => {
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
    onSubmit
  } = useEventForm();

  // If user can't create events, show upgrade message
  if (!canCreateEvents) {
    return <UpgradeCard />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
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
            />
          </TabsContent>
          
          <TabsContent value="customize">
            <CustomizeTab
              customization={customization}
              onCustomizationChange={setCustomization}
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
            />
          </TabsContent>
        </Tabs>
      </Card>
    </form>
  );
};

export default EventCreationForm;
