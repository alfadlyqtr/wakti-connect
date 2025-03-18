
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCustomization } from "@/types/event.types";
import BackgroundTab from "./tabs/BackgroundTab";
import TextTab from "./tabs/TextTab";
import ButtonsTab from "./tabs/ButtonsTab";
import HeaderTab from "./tabs/HeaderTab";
import FeaturesTab from "./tabs/FeaturesTab";
import CardEffectSelector from "./CardEffectSelector";
import ElementAnimationsSelector from "./ElementAnimationsSelector";

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
        ...customization.background,
        type,
        value
      }
    });
  };
  
  const handleBackgroundAngleChange = (angle: number) => {
    onCustomizationChange({
      ...customization,
      background: {
        ...customization.background,
        angle
      }
    });
  };
  
  const handleBackgroundDirectionChange = (direction: string) => {
    onCustomizationChange({
      ...customization,
      background: {
        ...customization.background,
        direction: direction as 'to-right' | 'to-left' | 'to-bottom' | 'to-top' | 'to-bottom-right' | 'to-bottom-left' | 'to-top-right' | 'to-top-left'
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
  
  const handleFontChange = (property: 'family' | 'size' | 'color' | 'weight' | 'alignment', value: string) => {
    onCustomizationChange({
      ...customization,
      font: {
        ...customization.font,
        [property]: value
      }
    });
  };
  
  const handleHeaderFontChange = (property: 'family' | 'size' | 'color' | 'weight', value: string) => {
    onCustomizationChange({
      ...customization,
      headerFont: {
        ...customization.headerFont || {},
        [property]: value
      }
    });
  };
  
  const handleDescriptionFontChange = (property: 'family' | 'size' | 'color' | 'weight', value: string) => {
    onCustomizationChange({
      ...customization,
      descriptionFont: {
        ...customization.descriptionFont || {},
        [property]: value
      }
    });
  };
  
  const handleDateTimeFontChange = (property: 'family' | 'size' | 'color' | 'weight', value: string) => {
    onCustomizationChange({
      ...customization,
      dateTimeFont: {
        ...customization.dateTimeFont || {},
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
      showAddToCalendarButton: checked
    });
  };
  
  const handleToggleButtons = (checked: boolean) => {
    onCustomizationChange({
      ...customization,
      showAcceptDeclineButtons: checked
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

  const handleCardEffectChange = (cardEffect: any) => {
    onCustomizationChange({
      ...customization,
      cardEffect
    });
  };

  const handleElementAnimationsChange = (elementAnimations: any) => {
    onCustomizationChange({
      ...customization,
      elementAnimations
    });
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 mb-4">
          <TabsTrigger value="background">Background</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="effects">Card Effect</TabsTrigger>
          <TabsTrigger value="animations">Animations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="background" className="space-y-4">
          <BackgroundTab 
            customization={customization}
            onBackgroundChange={handleBackgroundChange}
            onAnimationChange={handleAnimationChange}
            onBackgroundAngleChange={handleBackgroundAngleChange}
            onBackgroundDirectionChange={handleBackgroundDirectionChange}
            onHeaderImageChange={handleHeaderImageChange}
          />
        </TabsContent>
        
        <TabsContent value="text" className="space-y-4">
          <TextTab 
            customization={customization}
            onFontChange={handleFontChange}
            onHeaderFontChange={handleHeaderFontChange}
            onDescriptionFontChange={handleDescriptionFontChange}
            onDateTimeFontChange={handleDateTimeFontChange}
          />
        </TabsContent>
        
        <TabsContent value="buttons" className="space-y-4">
          <ButtonsTab 
            customization={customization}
            onButtonStyleChange={handleButtonStyleChange}
            onToggleButtons={handleToggleButtons}
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
            onToggleButtons={handleToggleButtons}
            onBrandingChange={handleBrandingChange}
            onMapDisplayChange={handleMapDisplayChange}
          />
        </TabsContent>
        
        <TabsContent value="effects" className="space-y-6">
          <CardEffectSelector 
            value={customization.cardEffect || {
              type: 'shadow',
              borderRadius: 'medium',
              border: false
            }}
            onChange={handleCardEffectChange}
          />
        </TabsContent>
        
        <TabsContent value="animations" className="space-y-6">
          <ElementAnimationsSelector 
            value={customization.elementAnimations || {
              text: 'none',
              buttons: 'none',
              icons: 'none',
              delay: 'none'
            }}
            onChange={handleElementAnimationsChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateFromScratchForm;
