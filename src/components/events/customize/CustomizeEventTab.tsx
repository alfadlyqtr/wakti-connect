import React, { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { EventCustomizationProvider, useEventCustomization } from '@/hooks/useEventCustomization';
import { EventCustomization } from '@/types/event.types';
import EventCardPreview from '../preview/EventCardPreview';
import { BackgroundSelector } from './inputs/BackgroundSelector';
import { EventSafeColorPicker } from './inputs/EventSafeColorPicker';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

// Font options for dropdown
const FONT_FAMILIES = [
  { value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', label: 'System UI' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: '"Times New Roman", serif', label: 'Times New Roman' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: '"Courier New", monospace', label: 'Courier New' },
  { value: 'Impact, sans-serif', label: 'Impact' }
];

// Tab content components to keep the main file organized
const TextTabContent: React.FC = () => {
  const { customization, setFontFamily, setFontColor } = useEventCustomization();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select 
            value={customization.font.family} 
            onValueChange={setFontFamily}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select font family" />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((font) => (
                <SelectItem key={font.label} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <EventSafeColorPicker
          label="Text Color"
          value={customization.font.color}
          onChange={setFontColor}
        />
      </div>
    </div>
  );
};

const ButtonsTabContent: React.FC = () => {
  const { 
    customization,
    setAcceptButtonSettings,
    setDeclineButtonSettings 
  } = useEventCustomization();
  
  const buttonShapes = [
    { value: 'rounded', label: 'Rounded' },
    { value: 'pill', label: 'Pill' },
    { value: 'square', label: 'Square' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Accept Button</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EventSafeColorPicker
            label="Background Color"
            value={customization.buttons.accept.background}
            onChange={(value) => setAcceptButtonSettings({ background: value })}
          />
          
          <EventSafeColorPicker
            label="Text Color"
            value={customization.buttons.accept.color}
            onChange={(value) => setAcceptButtonSettings({ color: value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Button Shape</Label>
          <Select 
            value={customization.buttons.accept.shape} 
            onValueChange={(value) => setAcceptButtonSettings({ 
              shape: value as 'rounded' | 'pill' | 'square' 
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select button shape" />
            </SelectTrigger>
            <SelectContent>
              {buttonShapes.map((shape) => (
                <SelectItem key={shape.value} value={shape.value}>
                  {shape.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border-t pt-4 space-y-4">
        <h3 className="text-sm font-medium">Decline Button</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EventSafeColorPicker
            label="Background Color"
            value={customization.buttons.decline.background}
            onChange={(value) => setDeclineButtonSettings({ background: value })}
          />
          
          <EventSafeColorPicker
            label="Text Color"
            value={customization.buttons.decline.color}
            onChange={(value) => setDeclineButtonSettings({ color: value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Button Shape</Label>
          <Select 
            value={customization.buttons.decline.shape} 
            onValueChange={(value) => setDeclineButtonSettings({ 
              shape: value as 'rounded' | 'pill' | 'square' 
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select button shape" />
            </SelectTrigger>
            <SelectContent>
              {buttonShapes.map((shape) => (
                <SelectItem key={shape.value} value={shape.value}>
                  {shape.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

const HeaderTabContent: React.FC = () => {
  const { customization, setHeaderStyle } = useEventCustomization();
  
  const headerStyles = [
    { value: 'simple', label: 'Simple' },
    { value: 'banner', label: 'Banner' },
    { value: 'minimal', label: 'Minimal' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Header Style</Label>
        <Select 
          value={customization.headerStyle} 
          onValueChange={setHeaderStyle}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select header style" />
          </SelectTrigger>
          <SelectContent>
            {headerStyles.map((style) => (
              <SelectItem key={style.value} value={style.value}>
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const FeaturesTabContent: React.FC = () => {
  const { customization, toggleFeature } = useEventCustomization();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="show-accept-decline"
          checked={customization.showAcceptDeclineButtons !== false}
          onChange={(e) => toggleFeature('showAcceptDeclineButtons', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <Label htmlFor="show-accept-decline">Show Accept/Decline Buttons</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="show-add-calendar"
          checked={customization.showAddToCalendarButton !== false}
          onChange={(e) => toggleFeature('showAddToCalendarButton', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <Label htmlFor="show-add-calendar">Show Add to Calendar Button</Label>
      </div>
    </div>
  );
};

// Main component
const CustomizeEventTab: React.FC<CustomizeEventTabProps> = ({ 
  customization: initialCustomization, 
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
  
  // Helper function to get a simple summary of customization for change detection
  const getCustomizationSummary = (customization: EventCustomization) => {
    return JSON.stringify({
      background: customization.background,
      font: customization.font?.color,
      buttons: {
        accept: customization.buttons?.accept?.background,
        decline: customization.buttons?.decline?.background
      },
      headerStyle: customization.headerStyle
    });
  };
  
  // Enhanced save draft handler with improved state synchronization and error handling
  const onSaveDraft = useCallback(async () => {
    try {
      setIsSaving(true);
      
      // Create a snapshot of current state for comparison
      const customizationSnapshot = getCustomizationSummary(initialCustomization);
      
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
            description: "Your event has been saved as a draft"
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
  }, [initialCustomization, handleSaveDraft]);

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
  
  // Background tab content with specific handlers
  const BackgroundTabContent = () => {
    const { customization, setBackground } = useEventCustomization();
    
    return (
      <BackgroundSelector
        backgroundType={customization.background.type}
        backgroundValue={customization.background.value}
        onBackgroundChange={setBackground}
        title={title}
        description={description}
      />
    );
  };

  return (
    <EventCustomizationProvider
      initialCustomization={initialCustomization}
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
                <TabsContent value="background">
                  <BackgroundTabContent />
                </TabsContent>
                
                <TabsContent value="text">
                  <TextTabContent />
                </TabsContent>
                
                <TabsContent value="buttons">
                  <ButtonsTabContent />
                </TabsContent>
                
                <TabsContent value="header">
                  <HeaderTabContent />
                </TabsContent>
                
                <TabsContent value="features">
                  <FeaturesTabContent />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <div className="order-first md:order-last sticky top-4">
            <EventCardPreview 
              customization={initialCustomization}
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
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Draft'}
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
    </EventCustomizationProvider>
  );
};

export default CustomizeEventTab;
