
import React from "react";
import { EventCustomization } from "@/types/event.types";
import { CustomizationProvider } from "../../customize/context";
import CustomizeTab from "../../customize/CustomizeTab";

interface CustomizeEventTabProps {
  customization: EventCustomization;
  onCustomizationChange: (customization: EventCustomization) => void;
  handleNextTab?: () => void;
  handleSaveDraft?: () => void;
  location?: string;
  locationTitle?: string;
  title?: string;
  description?: string;
  selectedDate?: Date;
}

const CustomizeEventTab: React.FC<CustomizeEventTabProps> = ({
  customization,
  onCustomizationChange,
  handleNextTab,
  handleSaveDraft,
  location,
  locationTitle,
  title,
  description,
  selectedDate,
}) => {
  return (
    <CustomizationProvider
      customization={customization}
      onCustomizationChange={onCustomizationChange}
    >
      <CustomizeTab
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
    </CustomizationProvider>
  );
};

export default CustomizeEventTab;
