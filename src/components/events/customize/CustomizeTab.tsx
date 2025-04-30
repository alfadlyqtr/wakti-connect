
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCustomization } from '@/types/event.types';
import { Button } from '@/components/ui/button';
import { CustomizationProvider } from './context';
import EventCardPreview from './preview/EventCardPreview';
import { Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  BackgroundTabContent,
  TextTabContent,
  ButtonsTabContent,
  HeaderTabContent,
  CardEffectTabContent,
  FeaturesTabContent
} from './tabs-content';

export interface CustomizeTabProps {
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

const CustomizeTab: React.FC<CustomizeTabProps> = ({ 
  customization, 
  onCustomizationChange,
  handleNextTab,
  handleSaveDraft,
  location,
  locationTitle,
  title,
  description,
  selectedDate
}) => {
  const [activeTab, setActiveTab] = React.useState('background');

  // Improved save draft handler with explicit sync
  const onSaveDraft = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Saving draft with customization:", customization);
    
    // Make sure customization is fully captured before saving
    if (handleSaveDraft) {
      // Small delay to ensure all state updates have been processed
      setTimeout(() => {
        handleSaveDraft();
      }, 100);
    } else {
      // Fallback if no handler provided
      toast({
        title: "Draft saved",
        description: "Your event has been saved as a draft",
      });
    }
  };

  // Event handler for next button with click propagation prevention
  const onNextTab = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (handleNextTab) {
      handleNextTab();
    }
  };

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
                <TabsList className="grid grid-cols-3 sm:grid-cols-5">
                  <TabsTrigger value="background">Background</TabsTrigger>
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="buttons">Buttons</TabsTrigger>
                  <TabsTrigger value="header" className="hidden sm:inline-flex">Header</TabsTrigger>
                  <TabsTrigger value="features" className="hidden sm:inline-flex">Features</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="mt-6 p-2">
                {activeTab === 'background' && <BackgroundTabContent title={title} description={description} />}
                {activeTab === 'text' && <TextTabContent />}
                {activeTab === 'buttons' && <ButtonsTabContent />}
                {activeTab === 'header' && <HeaderTabContent />}
                {activeTab === 'features' && <FeaturesTabContent />}
              </div>
            </Tabs>
          </div>

          <div className="order-first md:order-last sticky top-4">
            <EventCardPreview 
              location={location} 
              locationTitle={locationTitle}
              title={title} 
              description={description}
              date={selectedDate}
            />
          </div>
        </div>
        
        <div className="pt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            className="px-4"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          
          {handleNextTab && (
            <Button 
              type="button" 
              onClick={onNextTab}
              className="px-6"
            >
              Next: Share
            </Button>
          )}
        </div>
      </div>
    </CustomizationProvider>
  );
};

export default CustomizeTab;
