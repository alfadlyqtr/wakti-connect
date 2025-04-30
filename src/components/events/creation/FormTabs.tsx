import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventFormTab, EventCustomization } from "@/types/event.types";
import { InvitationRecipient } from "@/types/invitation.types";
import EventDetailsTab from "./tabs/EventDetailsTab";
import CustomizeEventTab from "../customize/CustomizeEventTab";
import EventShareTab from "./tabs/EventShareTab";
import { ShareTab } from "@/types/form.types";

interface FormTabsProps {
  activeTab: EventFormTab;
  setActiveTab: (tab: EventFormTab) => void;
  title: string;
  description: string;
  selectedDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  locationTitle?: string;
  customization: EventCustomization;
  onCustomizationChange: (customization: EventCustomization) => void;
  recipients: InvitationRecipient[];
  addRecipient: (recipient: InvitationRecipient) => void;
  removeRecipient: (index: number) => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onDateChange: (date: Date) => void;
  onLocationChange: (
    location: string, 
    locationType?: 'manual' | 'google_maps', 
    mapsUrl?: string,
    title?: string
  ) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onIsAllDayChange: (isAllDay: boolean) => void;
  isAllDay: boolean;
  locationType?: 'manual' | 'google_maps';
  mapsUrl?: string;
  getCurrentLocation: () => void;
  isGettingLocation: boolean;
  shareTab: ShareTab;
  setShareTab: (tab: ShareTab) => void;
  onSendEmail: (email: string) => void;
  handleSaveDraft?: () => void;
}

const FormTabs: React.FC<FormTabsProps> = ({
  activeTab,
  setActiveTab,
  title,
  description,
  selectedDate,
  startTime,
  endTime,
  location,
  locationTitle,
  customization,
  onCustomizationChange,
  recipients,
  addRecipient,
  removeRecipient,
  onTitleChange,
  onDescriptionChange,
  onDateChange,
  onLocationChange,
  onStartTimeChange,
  onEndTimeChange,
  onIsAllDayChange,
  isAllDay,
  locationType,
  mapsUrl,
  getCurrentLocation,
  isGettingLocation,
  shareTab,
  setShareTab,
  onSendEmail,
  handleSaveDraft
}) => {
  const handleNextTab = () => {
    if (activeTab === "details") setActiveTab("customize");
    if (activeTab === "customize") setActiveTab("share");
  };

  const handlePreviousTab = () => {
    if (activeTab === "share") setActiveTab("customize");
    if (activeTab === "customize") setActiveTab("details");
  };

  return (
    <Card className="mt-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as EventFormTab)} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="share">Share</TabsTrigger>
        </TabsList>
        <CardContent className="pt-6">
          <TabsContent value="details">
            <EventDetailsTab
              title={title}
              description={description}
              selectedDate={selectedDate}
              startTime={startTime}
              endTime={endTime}
              location={location}
              locationTitle={locationTitle}
              onTitleChange={onTitleChange}
              onDescriptionChange={onDescriptionChange}
              onDateChange={onDateChange}
              onLocationChange={onLocationChange}
              onStartTimeChange={onStartTimeChange}
              onEndTimeChange={onEndTimeChange}
              onIsAllDayChange={onIsAllDayChange}
              isAllDay={isAllDay}
              locationType={locationType}
              mapsUrl={mapsUrl}
              getCurrentLocation={getCurrentLocation}
              isGettingLocation={isGettingLocation}
              handleNextTab={handleNextTab}
            />
          </TabsContent>
          <TabsContent value="customize">
            <CustomizeEventTab
              customization={customization}
              onCustomizationChange={onCustomizationChange}
              handleNextTab={handleNextTab}
              handleSaveDraft={handleSaveDraft}
              location={location}
              locationTitle={locationTitle}
              title={title}
              description={description}
              selectedDate={selectedDate}
            />
          </TabsContent>
          <TabsContent value="share">
            <EventShareTab
              recipients={recipients}
              addRecipient={addRecipient}
              removeRecipient={removeRecipient}
              shareTab={shareTab}
              setShareTab={setShareTab}
              onSendEmail={onSendEmail}
              eventTitle={title}
              handlePreviousTab={handlePreviousTab}
            />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default FormTabs;
