
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventFormTab } from "@/types/form.types";
import { EventCustomization } from "@/types/event.types";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "@/types/event.types";
import { InvitationRecipient } from "@/types/invitation.types";

export interface FormTabsProps {
  activeTab: EventFormTab;
  setActiveTab: (tab: EventFormTab) => void;
  register?: any;
  errors?: any;
  selectedDate?: Date;
  setSelectedDate?: (date: Date) => void;
  startTime?: string;
  setStartTime?: (time: string) => void;
  endTime?: string;
  setEndTime?: (time: string) => void;
  isAllDay?: boolean;
  setIsAllDay?: (isAllDay: boolean) => void;
  customization?: EventCustomization;
  setCustomization?: (customization: EventCustomization) => void;
  recipients?: InvitationRecipient[];
  addRecipient?: (recipient: InvitationRecipient) => void;
  removeRecipient?: (index: number) => void;
  handleLocationChange?: (location: string, type: string) => void;
  location?: string;
  locationType?: string;
  form?: UseFormReturn<EventFormValues>;
  title?: string;
  setTitle?: (title: string) => void;
  description?: string;
  setDescription?: (description: string) => void;
  onSubmit?: () => void;
}

const FormTabs: React.FC<FormTabsProps> = ({ 
  activeTab, 
  setActiveTab
}) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as EventFormTab)}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="customize">Customize</TabsTrigger>
        <TabsTrigger value="share">Share</TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        Details content will be rendered here
      </TabsContent>
      
      <TabsContent value="customize">
        Customization options will be rendered here
      </TabsContent>
      
      <TabsContent value="share">
        Sharing options will be rendered here
      </TabsContent>
    </Tabs>
  );
};

export default FormTabs;
