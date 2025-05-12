
import React from 'react';
import { EventCustomization } from '@/types/event.types';
import { Button } from '@/components/ui/button';
import { CustomizationProvider } from '../customize/context';
import EventCardPreview from '../customize/preview/EventCardPreview';
import { Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  BackgroundTabContent,
  TextTabContent,
  ButtonsTabContent,
  HeaderTabContent,
  CardEffectTabContent,
  FeaturesTabContent
} from '../customize/tabs-content';

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

  // Save draft handler
  const onSaveDraft = () => {
    if (handleSaveDraft) {
      handleSaveDraft();
    } else {
      // Fallback if no handler provided
      toast({
        title: "Draft saved",
        description: "Your event has been saved as a draft",
      });
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
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    activeTab === "background" ? "bg-background text-foreground shadow-sm" : ""
                  }`}
                  onClick={() => setActiveTab("background")}
                >
                  Background
                </button>
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    activeTab === "text" ? "bg-background text-foreground shadow-sm" : ""
                  }`}
                  onClick={() => setActiveTab("text")}
                >
                  Text
                </button>
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    activeTab === "buttons" ? "bg-background text-foreground shadow-sm" : ""
                  }`}
                  onClick={() => setActiveTab("buttons")}
                >
                  Buttons
                </button>
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-md hidden sm:inline-flex ${
                    activeTab === "header" ? "bg-background text-foreground shadow-sm" : ""
                  }`}
                  onClick={() => setActiveTab("header")}
                >
                  Header
                </button>
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-md hidden sm:inline-flex ${
                    activeTab === "features" ? "bg-background text-foreground shadow-sm" : ""
                  }`}
                  onClick={() => setActiveTab("features")}
                >
                  Features
                </button>
              </div>
            </div>
              
            <div className="mt-6 p-2">
              {activeTab === 'background' && <BackgroundTabContent />}
              {activeTab === 'text' && <TextTabContent />}
              {activeTab === 'buttons' && <ButtonsTabContent />}
              {activeTab === 'header' && <HeaderTabContent />}
              {activeTab === 'features' && <FeaturesTabContent />}
            </div>
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
              onClick={handleNextTab}
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
