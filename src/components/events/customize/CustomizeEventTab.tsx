
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EventCustomization } from '@/types/event.types';
import { EventCustomizationProvider, useEventCustomization } from '@/hooks/useEventCustomization';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import LivePreview from '../customize/LivePreview';
import { Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface CustomizeEventTabProps {
  initialCustomization?: EventCustomization;
  onCustomizationChange?: (customization: EventCustomization) => void;
  onSaveDraft?: () => void;
  title?: string;
  description?: string;
  selectedDate?: Date;
  location?: string;
  locationTitle?: string;
}

const CustomizeEventTabContent = ({ 
  title, 
  description, 
  selectedDate,
  location,
  locationTitle,
  onSaveDraft 
}: CustomizeEventTabProps) => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [saving, setSaving] = useState(false);
  
  const { 
    customization, 
    setFontFamily, 
    setFontColor,
    setFontSize,
    setFontWeight,
    setFontAlignment,
    setAcceptButtonSettings,
    setDeclineButtonSettings,
    setHeaderStyle,
    toggleFeature,
    setBackground
  } = useEventCustomization();
  
  const handleSaveDraft = async () => {
    if (!onSaveDraft) return;
    
    try {
      setSaving(true);
      await onSaveDraft();
      toast({
        title: "Draft saved",
        description: "Your event customization has been saved",
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Save failed",
        description: "There was a problem saving your draft",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const fontOptions = [
    { value: "Inter", label: "Inter" },
    { value: "Poppins, sans-serif", label: "Poppins" },
    { value: "system-ui, sans-serif", label: "System UI" },
    { value: "Montserrat, sans-serif", label: "Montserrat" },
    { value: "Roboto, sans-serif", label: "Roboto" },
  ];

  const fontSizeOptions = [
    { value: "0.75rem", label: "Extra Small" },
    { value: "0.875rem", label: "Small" },
    { value: "1rem", label: "Medium" },
    { value: "1.125rem", label: "Large" },
    { value: "1.25rem", label: "Extra Large" },
  ];

  const handleAcceptButtonChange = (property: string, value: string) => {
    const current = customization.buttons.accept;
    setAcceptButtonSettings(
      property === 'background' ? value : current.background,
      property === 'color' ? value : current.color,
      property === 'shape' ? value as any : current.shape
    );
  };

  const handleDeclineButtonChange = (property: string, value: string) => {
    const current = customization.buttons.decline;
    setDeclineButtonSettings(
      property === 'background' ? value : current.background,
      property === 'color' ? value : current.color,
      property === 'shape' ? value as any : current.shape
    );
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'No date selected';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Tabs defaultValue="appearance" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              {activeTab === 'appearance' && (
                <TabsContent value="appearance" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Background</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bg-type">Type</Label>
                        <Select 
                          onValueChange={(value) => setBackground(value as "solid" | "image", customization.background.value)}
                          defaultValue={customization.background.type}
                        >
                          <SelectTrigger id="bg-type">
                            <SelectValue placeholder="Background type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solid">Solid Color</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {customization.background.type === 'solid' ? (
                        <div>
                          <Label htmlFor="bg-color">Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              id="bg-color"
                              value={customization.background.value}
                              onChange={(e) => setBackground('solid', e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              type="text"
                              value={customization.background.value}
                              onChange={(e) => setBackground('solid', e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Label htmlFor="bg-image">Image URL</Label>
                          <Input
                            type="text"
                            id="bg-image"
                            value={customization.background.value}
                            onChange={(e) => setBackground('image', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Header Style</h3>
                    <RadioGroup 
                      defaultValue={customization.headerStyle} 
                      onValueChange={(value) => setHeaderStyle(value as "simple" | "banner" | "minimal")}
                      className="grid grid-cols-3 gap-4"
                    >
                      <div className="flex flex-col items-center gap-2 border rounded-md p-4 hover:bg-muted/50 transition-colors">
                        <div className="w-full h-24 border rounded bg-white flex flex-col">
                          <div className="h-1/3 bg-gray-200 w-full"></div>
                          <div className="flex-1 p-2">
                            <div className="w-3/4 h-2 bg-gray-300 rounded mb-1"></div>
                            <div className="w-1/2 h-2 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="banner" id="banner" />
                          <Label htmlFor="banner">Banner</Label>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2 border rounded-md p-4 hover:bg-muted/50 transition-colors">
                        <div className="w-full h-24 border rounded bg-white flex flex-col p-2">
                          <div className="w-3/4 h-2 bg-gray-300 rounded mb-1"></div>
                          <div className="w-1/2 h-2 bg-gray-200 rounded mb-2"></div>
                          <div className="w-full h-10 bg-gray-100 rounded"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="simple" id="simple" />
                          <Label htmlFor="simple">Simple</Label>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2 border rounded-md p-4 hover:bg-muted/50 transition-colors">
                        <div className="w-full h-24 border rounded bg-white flex flex-col items-center p-2">
                          <div className="w-8 h-8 rounded-full bg-gray-300 mb-2"></div>
                          <div className="w-1/2 h-2 bg-gray-300 rounded mb-1"></div>
                          <div className="w-2/3 h-8 bg-gray-100 rounded mt-2"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="minimal" id="minimal" />
                          <Label htmlFor="minimal">Minimal</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Buttons</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-medium">Accept Button</h4>
                        <div>
                          <Label htmlFor="accept-bg">Background</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              id="accept-bg"
                              value={customization.buttons.accept.background}
                              onChange={(e) => handleAcceptButtonChange('background', e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              type="text"
                              value={customization.buttons.accept.background}
                              onChange={(e) => handleAcceptButtonChange('background', e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="accept-color">Text Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              id="accept-color"
                              value={customization.buttons.accept.color}
                              onChange={(e) => handleAcceptButtonChange('color', e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              type="text"
                              value={customization.buttons.accept.color}
                              onChange={(e) => handleAcceptButtonChange('color', e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium">Decline Button</h4>
                        <div>
                          <Label htmlFor="decline-bg">Background</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              id="decline-bg"
                              value={customization.buttons.decline.background}
                              onChange={(e) => handleDeclineButtonChange('background', e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              type="text"
                              value={customization.buttons.decline.background}
                              onChange={(e) => handleDeclineButtonChange('background', e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="decline-color">Text Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              id="decline-color"
                              value={customization.buttons.decline.color}
                              onChange={(e) => handleDeclineButtonChange('color', e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              type="text"
                              value={customization.buttons.decline.color}
                              onChange={(e) => handleDeclineButtonChange('color', e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="button-shape">Button Shape</Label>
                      <RadioGroup 
                        defaultValue={customization.buttons.accept.shape}
                        onValueChange={(value) => {
                          handleAcceptButtonChange('shape', value);
                          handleDeclineButtonChange('shape', value);
                        }}
                        className="flex gap-4"
                        id="button-shape"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="rounded" id="rounded" />
                          <Label htmlFor="rounded">Rounded</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="pill" id="pill" />
                          <Label htmlFor="pill">Pill</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="square" id="square" />
                          <Label htmlFor="square">Square</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </TabsContent>
              )}
              
              {activeTab === 'text' && (
                <TabsContent value="text" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Font Settings</h3>
                    <div>
                      <Label htmlFor="font-family">Font Family</Label>
                      <Select 
                        onValueChange={setFontFamily}
                        defaultValue={customization.font.family}
                      >
                        <SelectTrigger id="font-family">
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="font-size">Font Size</Label>
                      <Select 
                        onValueChange={setFontSize}
                        defaultValue={customization.font.size}
                      >
                        <SelectTrigger id="font-size">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {fontSizeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="font-color">Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          id="font-color"
                          value={customization.font.color}
                          onChange={(e) => setFontColor(e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={customization.font.color}
                          onChange={(e) => setFontColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="text-alignment">Text Alignment</Label>
                      <RadioGroup 
                        defaultValue={customization.font.alignment || "left"}
                        onValueChange={(value) => setFontAlignment(value as any)}
                        className="flex gap-4 mt-2"
                        id="text-alignment"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="left" id="left" />
                          <Label htmlFor="left">Left</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="center" id="center" />
                          <Label htmlFor="center">Center</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="right" id="right" />
                          <Label htmlFor="right">Right</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label htmlFor="font-weight">Font Weight</Label>
                      <Select 
                        onValueChange={setFontWeight}
                        defaultValue={customization.font.weight || "normal"}
                      >
                        <SelectTrigger id="font-weight">
                          <SelectValue placeholder="Select weight" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              )}
              
              {activeTab === 'features' && (
                <TabsContent value="features" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Feature Toggles</h3>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-buttons">Show Accept/Decline Buttons</Label>
                      <Switch 
                        id="show-buttons"
                        checked={customization.showAcceptDeclineButtons !== false}
                        onCheckedChange={(checked) => toggleFeature('showAcceptDeclineButtons', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="add-calendar">Add to Calendar Button</Label>
                      <Switch 
                        id="add-calendar"
                        checked={customization.showAddToCalendarButton !== false}
                        onCheckedChange={(checked) => {
                          toggleFeature('showAddToCalendarButton', checked);
                          toggleFeature('enableAddToCalendar', checked);
                        }}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Map Display</h4>
                      <RadioGroup 
                        defaultValue={customization.mapDisplay || "button"}
                        onValueChange={(value) => toggleFeature('mapDisplay', value)}
                        className="flex gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="button" id="map-button" />
                          <Label htmlFor="map-button">Button Only</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="both" id="map-both" />
                          <Label htmlFor="map-both">Button & Map Preview</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>

        <div className="order-first md:order-last md:sticky md:top-4">
          <div className="rounded-lg overflow-hidden">
            <LivePreview
              customization={customization}
              title={title || "Event Title"}
              description={description || "Event description will appear here."}
              date={formatDate(selectedDate)}
              location={location || "Event Location"}
              locationTitle={locationTitle}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={handleSaveDraft}
          variant="outline"
          disabled={saving}
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Draft'}
        </Button>
      </div>
    </div>
  );
};

const CustomizeEventTab: React.FC<CustomizeEventTabProps> = ({ 
  initialCustomization,
  onCustomizationChange,
  onSaveDraft,
  title,
  description,
  selectedDate,
  location,
  locationTitle
}) => {
  const [customization, setCustomization] = useState<EventCustomization>(
    initialCustomization || {
      background: { type: "solid", value: "#f3f4f6" },
      font: {
        family: "Inter",
        size: "1rem",
        color: "#374151",
        weight: "normal",
        alignment: "left",
      },
      buttons: {
        accept: { background: "#4f46e5", color: "#ffffff", shape: "rounded" },
        decline: { background: "#ef4444", color: "#ffffff", shape: "rounded" }
      },
      headerStyle: "simple",
      showAcceptDeclineButtons: true,
      showAddToCalendarButton: true
    }
  );

  useEffect(() => {
    if (onCustomizationChange) {
      onCustomizationChange(customization);
    }
  }, [customization, onCustomizationChange]);

  return (
    <EventCustomizationProvider initialCustomization={customization}>
      <CustomizeEventTabContent
        title={title}
        description={description}
        selectedDate={selectedDate}
        location={location}
        locationTitle={locationTitle}
        onSaveDraft={onSaveDraft}
      />
    </EventCustomizationProvider>
  );
};

export default CustomizeEventTab;
