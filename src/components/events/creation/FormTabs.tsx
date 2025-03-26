
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DetailsTab from "./DetailsTab";
import CustomizeTab from "../customize/CustomizeTab";
import ShareTab from "./ShareTab";
import { EventTab } from "@/types/event.types";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { EventFormData, EventCustomization } from "@/types/event.types";
import { InvitationRecipient } from "@/types/invitation.types";

interface FormTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  register: UseFormRegister<EventFormData>;
  errors: FieldErrors<EventFormData>;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  isAllDay: boolean;
  setIsAllDay: (isAllDay: boolean) => void;
  location: string;
  locationType: 'manual' | 'google_maps';
  mapsUrl?: string;
  handleLocationChange: (value: string, type: 'manual' | 'google_maps', mapsUrl?: string) => void;
  handleNextTab: () => void;
  handlePrevTab: () => void;
  customization: EventCustomization;
  setCustomization: (customization: EventCustomization) => void;
  shareTab: 'recipients' | 'links';
  setShareTab: (tab: 'recipients' | 'links') => void;
  recipients: InvitationRecipient[];
  addRecipient: (recipient: InvitationRecipient) => void;
  removeRecipient: (index: number) => void;
  handleSendEmail: (email: string) => void;
  isSubmitting: boolean;
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  isEdit: boolean;
}

const FormTabs: React.FC<FormTabsProps> = ({
  activeTab,
  setActiveTab,
  register,
  errors,
  selectedDate,
  setSelectedDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  isAllDay,
  setIsAllDay,
  location,
  locationType,
  mapsUrl,
  handleLocationChange,
  handleNextTab,
  handlePrevTab,
  customization,
  setCustomization,
  shareTab,
  setShareTab,
  recipients,
  addRecipient,
  removeRecipient,
  handleSendEmail,
  isSubmitting,
  title,
  description,
  setTitle,
  setDescription,
  isEdit
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-4 w-full max-w-md mx-auto">
        <TabsTrigger value="details" className="px-4 py-2 text-center">Details</TabsTrigger>
        <TabsTrigger value="customize" className="px-4 py-2 text-center">Customize</TabsTrigger>
        <TabsTrigger value="share" className="px-4 py-2 text-center">Share</TabsTrigger>
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
          isEdit={isEdit}
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
            className="px-4 py-2 border rounded-md hover:bg-muted transition-colors" 
            onClick={handlePrevTab}
          >
            Back
          </button>
          <button 
            type="button" 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" 
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
          isEdit={isEdit}
        />
      </TabsContent>
    </Tabs>
  );
};

export default FormTabs;
