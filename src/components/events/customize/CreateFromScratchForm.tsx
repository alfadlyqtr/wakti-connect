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
        <TabsList className="flex flex-wrap w-full mb-4 overflow-x-auto">
          <TabsTrigger value="background" className="px-2.5 py-1.5 text-xs sm:text-sm">Background</TabsTrigger>
          <TabsTrigger value="text" className="px-2.5 py-1.5 text-xs sm:text-sm">Text</TabsTrigger>
          <TabsTrigger value="buttons" className="px-2.5 py-1.5 text-xs sm:text-sm">Buttons</TabsTrigger>
          <TabsTrigger value="header" className="px-2.5 py-1.5 text-xs sm:text-sm">Header</TabsTrigger>
          <TabsTrigger value="features" className="px-2.5 py-1.5 text-xs sm:text-sm">Features</TabsTrigger>
          <TabsTrigger value="effects" className="px-2.5 py-1.5 text-xs sm:text-sm">Card Effect</TabsTrigger>
          <TabsTrigger value="animations" className="px-2.5 py-1.5 text-xs sm:text-sm">Animations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="background" className="space-y-4">
          <BackgroundTab 
            customization={customization}
            onBackgroundChange={handleBackgroundChange}
            onAnimationChange={customization.animation ? (val) => onCustomizationChange({...customization, animation: val}) : undefined}
            onBackgroundAngleChange={handleBackgroundAngleChange}
            onBackgroundDirectionChange={handleBackgroundDirectionChange}
            onHeaderImageChange={customization.headerImage ? (val) => onCustomizationChange({...customization, headerImage: val}) : undefined}
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
            onToggleCalendarButton={handleToggleCalendar}
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

        <TabsContent value="more" className="space-y-6 sm:hidden">
          <Tabs defaultValue="features">
            <TabsList className="grid grid-cols-3 mb-4 w-full">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="effects">Card Effect</TabsTrigger>
              <TabsTrigger value="animations">Animations</TabsTrigger>
            </TabsList>
            
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateFromScratchForm;
