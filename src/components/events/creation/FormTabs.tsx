
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
  endTime
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
