
import React, { useState } from "react";
import { EventCustomization } from "@/types/event.types";
import { CustomizationProvider } from "./context/CustomizationContext";
import CustomizationTabs from "./CustomizationTabs";

interface CreateFromScratchFormProps {
  customization: EventCustomization;
  onCustomizationChange: (customization: EventCustomization) => void;
}

const CreateFromScratchForm: React.FC<CreateFromScratchFormProps> = ({
  customization,
  onCustomizationChange
}) => {
  const [activeTab, setActiveTab] = useState("background");
  
  return (
    <CustomizationProvider
      customization={customization}
      onCustomizationChange={onCustomizationChange}
    >
      <div>
        <CustomizationTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </CustomizationProvider>
  );
};

export default CreateFromScratchForm;
