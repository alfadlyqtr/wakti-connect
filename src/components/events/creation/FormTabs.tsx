
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventFormTab, EventCustomization } from '@/types/event.types';
import { InvitationRecipient } from '@/types/invitation.types'; 
import DetailsTab from './DetailsTab';
import CustomizeTab from '../customize/CustomizeTab';
import ShareTabContent from '../sharing/ShareTabContent';
import { ShareTab } from '@/types/form.types';

interface FormTabsProps {
  activeTab: EventFormTab;
  setActiveTab: (tab: EventFormTab) => void;
  title: string;
  description: string;
  selectedDate: Date;
  location: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  customization: EventCustomization;
  onCustomizationChange: (customization: EventCustomization) => void;
  recipients: InvitationRecipient[];
  addRecipient: (recipient: InvitationRecipient) => void;
  removeRecipient: (index: number) => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onDateChange: (date: Date) => void;
  onLocationChange: (location: string, type?: 'manual' | 'google_maps', url?: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onIsAllDayChange: (isAllDay: boolean) => void;
  locationType?: 'manual' | 'google_maps';
  mapsUrl?: string;
  getCurrentLocation: () => void;
  isGettingLocation: boolean;
  shareTab: ShareTab;
  setShareTab: (tab: ShareTab) => void;
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
  isAllDay,
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
  locationType,
  mapsUrl,
  getCurrentLocation,
  isGettingLocation,
  shareTab,
  setShareTab,
  onSendEmail
}) => {
  const handleNextFromDetails = () => setActiveTab("customize");
  const handleNextFromCustomize = () => setActiveTab("share");

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as EventFormTab)}
      className="space-y-6 pt-6"
    >
      <TabsList className="grid grid-cols-3 w-full sm:w-auto">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="customize">Customize</TabsTrigger>
        <TabsTrigger value="share">Share</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details">
        <DetailsTab 
          title={title}
          description={description}
          location={location}
          selectedDate={selectedDate}
          startTime={startTime}
          endTime={endTime}
          isAllDay={isAllDay}
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
          onLocationChange={onLocationChange}
          onDateChange={onDateChange}
          onStartTimeChange={onStartTimeChange}
          onEndTimeChange={onEndTimeChange}
          onIsAllDayChange={onIsAllDayChange}
          handleNextTab={handleNextFromDetails}
          locationType={locationType}
          mapsUrl={mapsUrl}
          getCurrentLocation={getCurrentLocation}
          isGettingLocation={isGettingLocation}
        />
      </TabsContent>
      
      <TabsContent value="customize">
        <CustomizeTab 
          customization={customization}
          onCustomizationChange={onCustomizationChange}
          handleNextTab={handleNextFromCustomize}
          location={location}
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
    </Tabs>
  );
};

export default FormTabs;
