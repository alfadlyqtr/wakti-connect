import React from 'react';
import { EventFormTab, EventCustomization } from '@/types/event.types';
import DetailsTab from '@/components/events/creation/DetailsTab'; // Fixed import path
import CustomizeTab from '../customize/CustomizeTab';
import ShareLinksTab from '@/components/events/creation/ShareLinksTab'; // Fixed import and component name
import { ShareTab } from '@/types/form.types';
import { InvitationRecipient } from '@/types/invitation.types';

interface FormTabsBaseProps {
  activeTab: EventFormTab;
  setActiveTab: (tab: EventFormTab) => void;
}

interface FormTabsProps extends FormTabsBaseProps {
  title: string;
  description: string;
  selectedDate: Date;
  location: string;
  locationTitle?: string;
  startTime: string;
  endTime: string;
  customization: EventCustomization;
  onCustomizationChange: (customization: EventCustomization) => void;
  recipients: InvitationRecipient[];
  addRecipient: (recipient: InvitationRecipient) => void;
  removeRecipient: (index: number) => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onDateChange: (date: Date) => void;
  onLocationChange: (location: string, type?: 'manual' | 'google_maps', url?: string, title?: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onIsAllDayChange: (isAllDay: boolean) => void;
  isAllDay: boolean;
  locationType: 'manual' | 'google_maps';
  mapsUrl: string;
  getCurrentLocation: () => void;
  isGettingLocation: boolean;
  shareTab: ShareTab;
  setShareTab: (tab: ShareTab) => void;
  onSendEmail: (email: string) => void;
  handleSaveDraft?: () => void;
}

export const FormTabs: React.FC<FormTabsProps> = ({
  activeTab,
  setActiveTab,
  title,
  description,
  selectedDate,
  location,
  locationTitle,
  startTime,
  endTime,
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
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'details':
        return (
          <DetailsTab
            title={title}
            description={description}
            selectedDate={selectedDate}
            location={location}
            locationTitle={locationTitle}
            startTime={startTime}
            endTime={endTime}
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
            handleNextTab={() => setActiveTab("customize")}
          />
        );
      case 'customize':
        return (
          <CustomizeTab 
            customization={customization}
            onCustomizationChange={onCustomizationChange}
            handleNextTab={() => setActiveTab("share")}
            handleSaveDraft={handleSaveDraft}
            location={location}
            locationTitle={locationTitle}
            title={title}
            description={description}
            selectedDate={selectedDate}
          />
        );
      case 'share':
        return (
          <ShareLinksTab
            onSendEmail={onSendEmail}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-8">
      <div className="flex border-b">
        <button
          type="button"
          className={`px-4 py-2 font-medium ${
            activeTab === "details"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
        <button
          type="button"
          className={`px-4 py-2 font-medium ${
            activeTab === "customize"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("customize")}
        >
          Customize
        </button>
        <button
          type="button"
          className={`px-4 py-2 font-medium ${
            activeTab === "share"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("share")}
        >
          Share
        </button>
      </div>
      
      <div className="py-6">{renderActiveTab()}</div>
    </div>
  );
};

export default FormTabs;
