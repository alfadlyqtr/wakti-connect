
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCustomization } from '@/types/event.types';
import { Button } from '@/components/ui/button';
import { CustomizationProvider } from './context';
import EventCardPreview from './preview/EventCardPreview';
import {
  BackgroundTabContent,
  TextTabContent,
  ButtonsTabContent,
  HeaderTabContent,
  AnimationsTabContent,
  CardEffectTabContent,
  FeaturesTabContent
} from './tabs-content';

export interface CustomizeTabProps {
  customization: EventCustomization;
  onCustomizationChange: (customization: EventCustomization) => void;
  handleNextTab?: () => void;
  location?: string;
  locationTitle?: string;
}

const CustomizeTab: React.FC<CustomizeTabProps> = ({ 
  customization, 
  onCustomizationChange,
  handleNextTab,
  location,
  locationTitle
}) => {
  const [activeTab, setActiveTab] = React.useState('background');

  return (
    <CustomizationProvider
      customization={customization}
      onCustomizationChange={onCustomizationChange}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Tabs 
              defaultValue="background" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex justify-center mb-6">
                <TabsList className="grid grid-cols-3 sm:grid-cols-7">
                  <TabsTrigger value="background">Background</TabsTrigger>
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="buttons">Buttons</TabsTrigger>
                  <TabsTrigger value="header" className="hidden sm:inline-flex">Header</TabsTrigger>
                  <TabsTrigger value="effects" className="hidden sm:inline-flex">Effects</TabsTrigger>
                  <TabsTrigger value="animations" className="hidden sm:inline-flex">Animations</TabsTrigger>
                  <TabsTrigger value="features" className="hidden sm:inline-flex">Features</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="mt-6 p-2">
                {activeTab === 'background' && <BackgroundTabContent />}
                {activeTab === 'text' && <TextTabContent />}
                {activeTab === 'buttons' && <ButtonsTabContent />}
                {activeTab === 'header' && <HeaderTabContent />}
                {activeTab === 'animations' && <AnimationsTabContent />}
                {activeTab === 'effects' && <CardEffectTabContent />}
                {activeTab === 'features' && <FeaturesTabContent />}
              </div>
            </Tabs>
          </div>

          <div className="order-first md:order-last sticky top-4">
            <EventCardPreview location={location} locationTitle={locationTitle} />
          </div>
        </div>
        
        {handleNextTab && (
          <div className="pt-4 flex justify-end">
            <Button 
              type="button" 
              onClick={handleNextTab}
              className="px-6"
            >
              Next: Share
            </Button>
          </div>
        )}
      </div>
    </CustomizationProvider>
  );
};

export default CustomizeTab;
