
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCustomization } from "@/types/event.types";
import BackgroundTab from "./tabs/BackgroundTab";
import TextTab from "./tabs/TextTab";
import ButtonsTab from "./tabs/ButtonsTab";
import HeaderTab from "./tabs/HeaderTab";
import FeaturesTab from "./tabs/FeaturesTab";

interface CreateFromScratchFormProps {
  customization: EventCustomization;
  onCustomizationChange: (customization: EventCustomization) => void;
}

const CreateFromScratchForm: React.FC<CreateFromScratchFormProps> = ({
  customization,
  onCustomizationChange
}) => {
  const [activeTab, setActiveTab] = useState("background");
  
  const handleBackgroundChange = (type: 'color' | 'gradient' | 'image', value: string) => {
    onCustomizationChange({
      ...customization,
      background: {
        type,
        value
      }
    });
  };
  
  const handleButtonStyleChange = (type: 'accept' | 'decline', property: 'background' | 'color' | 'shape', value: string) => {
    onCustomizationChange({
      ...customization,
      buttons: {
        ...customization.buttons,
        [type]: {
          ...customization.buttons[type],
          [property]: value
        }
      }
    });
  };
  
  const handleFontChange = (property: 'family' | 'size' | 'color', value: string) => {
    onCustomizationChange({
      ...customization,
      font: {
        ...customization.font,
        [property]: value
      }
    });
  };
  
  const handleHeaderStyleChange = (style: 'banner' | 'simple' | 'minimal') => {
    onCustomizationChange({
      ...customization,
      headerStyle: style
    });
  };
  
  const handleHeaderImageChange = (imageUrl: string) => {
    onCustomizationChange({
      ...customization,
      headerImage: imageUrl
    });
  };
  
  const handleToggleChatbot = (checked: boolean) => {
    onCustomizationChange({
      ...customization,
      enableChatbot: checked
    });
  };
  
  const handleToggleCalendar = (checked: boolean) => {
    onCustomizationChange({
      ...customization,
      enableAddToCalendar: checked
    });
  };
  
  const handleBrandingChange = (property: 'logo' | 'slogan', value: string) => {
    onCustomizationChange({
      ...customization,
      branding: {
        ...customization.branding || {},
        [property]: value
      }
    });
  };
  
  const handleAnimationChange = (value: 'fade' | 'slide' | 'pop') => {
    onCustomizationChange({
      ...customization,
      animation: value
    });
  };
  
  const handleMapDisplayChange = (value: 'button' | 'qrcode' | 'both') => {
    onCustomizationChange({
      ...customization,
      mapDisplay: value
    });
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="background">Background</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="background" className="space-y-4">
          <BackgroundTab 
            customization={customization}
            onBackgroundChange={handleBackgroundChange}
            onAnimationChange={handleAnimationChange}
          />
        </TabsContent>
        
        <TabsContent value="text" className="space-y-4">
          <TextTab 
            customization={customization}
            onFontChange={handleFontChange}
          />
        </TabsContent>
        
        <TabsContent value="buttons" className="space-y-4">
          <ButtonsTab 
            customization={customization}
            onButtonStyleChange={handleButtonStyleChange}
          />
        </TabsContent>
        
        <TabsContent value="header" className="space-y-6">
          <HeaderTab 
            customization={customization}
            onHeaderStyleChange={handleHeaderStyleChange}
            onHeaderImageChange={handleHeaderImageChange}
          />
        </TabsContent>
        
        <TabsContent value="features" className="space-y-6">
          <FeaturesTab 
            customization={customization}
            onToggleChatbot={handleToggleChatbot}
            onToggleCalendar={handleToggleCalendar}
            onBrandingChange={handleBrandingChange}
            onMapDisplayChange={handleMapDisplayChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateFromScratchForm;
