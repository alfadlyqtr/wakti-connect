
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DetailsTab from "./DetailsTab";
import CustomizeTab from "../customize/CustomizeTab";
import ShareTabContent from "../sharing/ShareTabContent";
import { EventFormTab } from "@/types/event.types";
import { EventCustomization } from "@/types/event.types";
import { InvitationRecipient } from "@/types/invitation.types";
import { ShareTab } from "@/types/form.types";

interface FormTabsProps {
  activeTab: EventFormTab;
  setActiveTab: (tab: EventFormTab) => void;
  title: string;
  description: string;
  selectedDate: Date;
  location: string;
  startTime: string;
  endTime: string;
  customization: EventCustomization;
  recipients: InvitationRecipient[];
  shareTab: ShareTab;
  setShareTab: (tab: ShareTab) => void;
  addRecipient: (recipient: InvitationRecipient) => void;
  removeRecipient: (index: number) => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onDateChange: (date: Date) => void;
  onLocationChange: (location: string, type?: 'manual' | 'google_maps', url?: string) => void;
  onStartTimeChange: (startTime: string) => void;
  onEndTimeChange: (endTime: string) => void;
  onIsAllDayChange: (isAllDay: boolean) => void;
  isAllDay: boolean;
  onCustomizationChange: (customization: EventCustomization) => void;
  locationType: 'manual' | 'google_maps';
  mapsUrl?: string;
  getCurrentLocation?: () => void;
  isGettingLocation?: boolean;
  onSendEmail: (email: string) => void;
}

const FormTabs: React.FC<FormTabsProps> = ({
  activeTab,
  setActiveTab,
  title,
  description,
  selectedDate,
  location,
  startTime,
  endTime,
  customization,
  recipients,
  shareTab,
  setShareTab,
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
  onCustomizationChange,
  locationType,
  mapsUrl,
  getCurrentLocation,
  isGettingLocation,
  onSendEmail
}) => {
  const handleNextTab = () => {
    if (activeTab === "details") setActiveTab("customize");
    if (activeTab === "customize") setActiveTab("share");
  };

  return (
    <Tabs value={activeTab} className="w-full mb-6">
      <div className="flex justify-center mb-6">
        <TabsList>
          <TabsTrigger 
            value="details" 
            onClick={() => setActiveTab("details")}
            data-active={activeTab === "details"}
          >
            Details
          </TabsTrigger>
          <TabsTrigger 
            value="customize" 
            onClick={() => setActiveTab("customize")}
            data-active={activeTab === "customize"}
          >
            Customize
          </TabsTrigger>
          <TabsTrigger 
            value="share" 
            onClick={() => setActiveTab("share")}
            data-active={activeTab === "share"}
          >
            Share
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="mt-6">
        <TabsContent value="details">
          <DetailsTab 
            register={() => {}}
            errors={{}}
            selectedDate={selectedDate}
            setSelectedDate={onDateChange}
            startTime={startTime}
            setStartTime={onStartTimeChange}
            endTime={endTime}
            setEndTime={onEndTimeChange}
            isAllDay={isAllDay}
            setIsAllDay={onIsAllDayChange}
            location={location}
            locationType={locationType}
            mapsUrl={mapsUrl}
            handleLocationChange={onLocationChange}
            handleNextTab={handleNextTab}
            title={title}
            description={description}
            setTitle={onTitleChange}
            setDescription={onDescriptionChange}
          />
        </TabsContent>

        <TabsContent value="customize">
          <CustomizeTab 
            customization={customization} 
            onCustomizationChange={onCustomizationChange} 
            onNextTab={handleNextTab} 
          />
        </TabsContent>

        <TabsContent value="share">
          <ShareTabContent 
            recipients={recipients}
            addRecipient={addRecipient}
            removeRecipient={removeRecipient}
            activeTab={shareTab}
            setActiveTab={setShareTab}
            eventTitle={title}
            onSendEmail={onSendEmail}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default FormTabs;
