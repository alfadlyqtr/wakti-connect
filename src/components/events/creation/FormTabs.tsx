
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventFormTab, EventCustomization } from "@/types/event.types";
import DetailsTabContent from "../details/DetailsTabContent";
import CustomizeTab from "../customize/CustomizeTab";
import ShareTabContent from "../sharing/ShareTabContent";
import { InvitationRecipient } from "@/types/invitation.types";
import { ShareTab } from "@/types/form.types";

export interface FormTabsProps {
  activeTab: EventFormTab;
  setActiveTab: (tab: EventFormTab) => void;
  title?: string;
  description?: string;
  selectedDate?: Date;
  location?: string;
  customization?: EventCustomization;
  onCustomizationChange?: (customization: EventCustomization) => void;
  recipients?: InvitationRecipient[]; 
  addRecipient?: (recipient: InvitationRecipient) => void;
  removeRecipient?: (index: number) => void;
  startTime?: string;
  endTime?: string;
  isAllDay?: boolean;
  locationType?: 'manual' | 'google_maps';
  mapsUrl?: string;
  shareTab?: ShareTab;
  setShareTab?: (tab: ShareTab) => void;
  onSendEmail?: (email: string) => void;
  onTitleChange?: (title: string) => void;
  onDescriptionChange?: (description: string) => void;
  onDateChange?: (date: Date) => void;
  onLocationChange?: (location: string, type?: 'manual' | 'google_maps', url?: string) => void;
  onStartTimeChange?: (time: string) => void;
  onEndTimeChange?: (time: string) => void;
  onIsAllDayChange?: (isAllDay: boolean) => void;
  getCurrentLocation?: () => void;
  isGettingLocation?: boolean;
}

const FormTabs: React.FC<FormTabsProps> = ({ 
  activeTab, 
  setActiveTab,
  title = "",
  description = "",
  selectedDate,
  location = "",
  customization,
  onCustomizationChange,
  recipients = [],
  addRecipient,
  removeRecipient,
  startTime,
  endTime,
  isAllDay = false,
  locationType,
  mapsUrl,
  shareTab,
  setShareTab,
  onSendEmail,
  onTitleChange,
  onDescriptionChange,
  onDateChange,
  onLocationChange,
  onStartTimeChange,
  onEndTimeChange,
  onIsAllDayChange,
  getCurrentLocation,
  isGettingLocation
}) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as EventFormTab)}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="customize">Customize</TabsTrigger>
        <TabsTrigger value="share">Share</TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <DetailsTabContent 
          title={title}
          description={description}
          selectedDate={selectedDate}
          location={location}
          startTime={startTime}
          endTime={endTime}
          isAllDay={isAllDay}
          locationType={locationType}
          mapsUrl={mapsUrl}
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
          onDateChange={onDateChange}
          onLocationChange={onLocationChange}
          onStartTimeChange={onStartTimeChange}
          onEndTimeChange={onEndTimeChange}
          onIsAllDayChange={onIsAllDayChange}
          getCurrentLocation={getCurrentLocation}
          isGettingLocation={isGettingLocation}
        />
      </TabsContent>
      
      <TabsContent value="customize">
        {customization && onCustomizationChange && (
          <CustomizeTab 
            customization={customization}
            onCustomizationChange={onCustomizationChange}
            title={title}
            description={description}
            location={location}
            selectedDate={selectedDate}
            startTime={startTime}
            endTime={endTime}
          />
        )}
      </TabsContent>
      
      <TabsContent value="share">
        <ShareTabContent 
          recipients={recipients}
          addRecipient={addRecipient}
          removeRecipient={removeRecipient}
          shareTab={shareTab}
          setShareTab={setShareTab}
          onSendEmail={onSendEmail}
        />
      </TabsContent>
    </Tabs>
  );
};

export default FormTabs;
