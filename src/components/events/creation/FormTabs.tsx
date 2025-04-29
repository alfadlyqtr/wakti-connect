
import React from 'react';
import { EventFormTab } from '@/types/event.types';
import DetailsTab from '../details/DetailsTab'; // Changed import path
import CustomizeTab from '../customize/CustomizeTab';
import ShareTab from '../share/ShareTab';
import { ShareTab as ShareTabType } from '@/types/form.types';

interface FormTabsProps {
  activeTab: EventFormTab;
  setActiveTab: (tab: EventFormTab) => void;
  title: string;
  description: string;
  selectedDate: Date;
  location: string;
  locationTitle?: string;
  startTime: string;
  endTime: string;
  customization: any;
  onCustomizationChange: (customization: any) => void;
  recipients: any[];
  addRecipient: (recipient: any) => void;
  removeRecipient: (index: number) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDateChange: (value: Date) => void;
  onLocationChange: (location: string, type?: 'manual' | 'google_maps', url?: string, title?: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onIsAllDayChange: (value: boolean) => void;
  isAllDay: boolean;
  locationType: 'manual' | 'google_maps';
  mapsUrl?: string;
  getCurrentLocation: () => void;
  isGettingLocation: boolean;
  shareTab: ShareTabType;
  setShareTab: (tab: ShareTabType) => void;
  onSendEmail: (email: string) => void;
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
  onSendEmail
}) => {
  const renderActiveTab = () => {
    switch (activeTab) {
      case "details":
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
      case "customize":
        return (
          <CustomizeTab 
            customization={customization}
            onCustomizationChange={onCustomizationChange}
            handleNextTab={() => setActiveTab("share")}
            location={location}
            locationTitle={locationTitle}
            title={title}
            description={description}
            selectedDate={selectedDate}
          />
        );
      case "share":
        return (
          <ShareTab
            recipients={recipients}
            addRecipient={addRecipient}
            removeRecipient={removeRecipient}
            activeTab={shareTab}
            setActiveTab={setShareTab}
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
