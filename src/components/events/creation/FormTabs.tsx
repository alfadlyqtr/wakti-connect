
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventFormTab, EventCustomization } from "@/types/event.types";
import DetailsTabContent from "../details/DetailsTabContent";
import CustomizeTab from "../customize/CustomizeTab";
import ShareTabContent from "../sharing/ShareTabContent";
import { InvitationRecipient } from "@/types/invitation.types";

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
  onTitleChange?: (title: string) => void;
  onDescriptionChange?: (description: string) => void;
  onDateChange?: (date: Date) => void;
  onLocationChange?: (location: string) => void;
  onStartTimeChange?: (time: string) => void;
  onEndTimeChange?: (time: string) => void;
  onIsAllDayChange?: (isAllDay: boolean) => void;
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
  onTitleChange,
  onDescriptionChange,
  onDateChange,
  onLocationChange,
  onStartTimeChange,
  onEndTimeChange,
  onIsAllDayChange
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
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
          onDateChange={onDateChange}
          onLocationChange={onLocationChange}
          onStartTimeChange={onStartTimeChange}
          onEndTimeChange={onEndTimeChange}
          onIsAllDayChange={onIsAllDayChange}
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
        />
      </TabsContent>
    </Tabs>
  );
};

export default FormTabs;
