
import React, { useEffect, useState, useCallback } from 'react';
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
  const [activeTab, setActiveTab] = useState('background');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedState, setLastSavedState] = useState<string>('');
  
  // Debug customization state changes
  useEffect(() => {
    const customizationSummary = JSON.stringify({
      background: customization.background,
      font: customization.font?.color,
      buttons: {
        accept: customization.buttons?.accept?.background,
        decline: customization.buttons?.decline?.background
      },
      headerStyle: customization.headerStyle
    });
    
    console.log("[CustomizeTab] Customization updated");
    
    // Update last saved state if current state differs
    if (lastSavedState && lastSavedState !== customizationSummary) {
      console.log("[CustomizeTab] Customization changed since last save");
    }
  }, [customization, lastSavedState]);

  // Enhanced save draft handler with improved state synchronization and error handling
  const onSaveDraft = useCallback(async () => {
    try {
      setIsSaving(true);
      
      console.log("[CustomizeTab] Saving draft with customization:", {
        background: customization.background,
        font: customization.font,
        buttons: customization.buttons,
        headerStyle: customization.headerStyle
      });
      
      // Create a snapshot of current state for comparison
      const customizationSnapshot = JSON.stringify({
        background: customization.background,
        font: customization.font?.color,
        buttons: {
          accept: customization.buttons?.accept?.background,
          decline: customization.buttons?.decline?.background
        },
        headerStyle: customization.headerStyle
      });
      
      if (handleSaveDraft) {
        // Show feedback to user
        toast({
          title: "Saving draft...",
          description: "Your event customization is being saved"
        });
        
        try {
          // Call the provided handler with current state
          await Promise.resolve(handleSaveDraft());
          
          // Update last saved state after successful save
          setLastSavedState(customizationSnapshot);
          
          // Show success message
          toast({
            title: "Draft saved",
            description: "Your event has been saved as a draft",
            variant: "success"
          });
        } catch (error) {
          console.error("Error in handleSaveDraft:", error);
          throw error;
        }
      } else {
        // Fallback if no handler provided
        toast({
          title: "Draft saved",
          description: "Your event has been saved as a draft",
        });
        
        // Update last saved state
        setLastSavedState(customizationSnapshot);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Save failed",
        description: "There was a problem saving your draft",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }, [customization, handleSaveDraft]);

  // Event handler for next button with error handling
  const onNextTab = useCallback(() => {
    try {
      if (handleNextTab) {
        handleNextTab();
      }
    } catch (error) {
      console.error("Error navigating to next tab:", error);
      toast({
        title: "Navigation error",
        description: "There was a problem moving to the next tab",
        variant: "destructive"
      });
    }
  }, [handleNextTab]);

  // Universal event stopper
  const stopPropagation = useCallback((e: React.UIEvent) => {
    e.stopPropagation();
    if ('nativeEvent' in e) {
      e.nativeEvent.stopImmediatePropagation();
    }
  }, []);

  return (
    <CustomizationProvider
      customization={customization}
      onCustomizationChange={onCustomizationChange}
    >
      <div 
        className="space-y-6"
        onClick={stopPropagation}
        onMouseDown={stopPropagation}
        onPointerDown={stopPropagation}
      >
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSaveDraft();
            }}
            className="px-4"
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
          
          {handleNextTab && (
            <Button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onNextTab();
              }}
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
