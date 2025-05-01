import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  SimpleInvitationCustomization, 
  BackgroundType,
  TextPosition,
  ButtonPosition, 
  ButtonShape 
} from '@/types/invitation.types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HexColorPicker } from 'react-colorful';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import TextPositionSelector from './TextPositionSelector';
import ButtonPositionSelector from './ButtonPositionSelector';

interface InvitationStylerProps {
  customization: SimpleInvitationCustomization;
  onChange: (customization: SimpleInvitationCustomization) => void;
  hasLocation?: boolean;
  isEvent?: boolean;
}

export default function InvitationStyler({ 
  customization, 
  onChange,
  hasLocation = false,
  isEvent = false
}: InvitationStylerProps) {
  const [activeTab, setActiveTab] = React.useState('background');
  
  const handleBackgroundTypeChange = (type: BackgroundType) => {
    onChange({
      ...customization,
      background: {
        ...customization.background,
        type
      }
    });
  };
  
  const handleBackgroundValueChange = (value: string) => {
    onChange({
      ...customization,
      background: {
        ...customization.background,
        value
      }
    });
  };
  
  const handleFontChange = (property: string, value: string) => {
    onChange({
      ...customization,
      font: {
        ...customization.font,
        [property]: value
      }
    });
  };
  
  const handleTextPositionChange = (position: TextPosition) => {
    onChange({
      ...customization,
      textLayout: {
        ...customization.textLayout || { contentPosition: 'middle', spacing: 'normal' },
        contentPosition: position
      }
    });
  };
  
  const handleSpacingChange = (spacing: 'compact' | 'normal' | 'spacious') => {
    onChange({
      ...customization,
      textLayout: {
        ...customization.textLayout || { contentPosition: 'middle', spacing: 'normal' },
        spacing
      }
    });
  };
  
  const handleButtonStyleChange = (buttonType: 'accept' | 'decline', property: 'background' | 'color' | 'shape', value: string) => {
    if (!customization.buttons) return;
    
    onChange({
      ...customization,
      buttons: {
        ...customization.buttons,
        [buttonType]: {
          ...customization.buttons[buttonType],
          [property]: value
        }
      }
    });
  };
  
  const handlePositionChange = (buttonType: 'directions' | 'calendar', position: ButtonPosition) => {
    if (!customization.buttons) return;
    
    onChange({
      ...customization,
      buttons: {
        ...customization.buttons,
        [buttonType]: {
          ...customization.buttons[buttonType],
          position
        }
      }
    });
  };

  const handleButtonVisibilityChange = (buttonType: 'directions' | 'calendar', show: boolean) => {
    if (!customization.buttons) return;
    
    onChange({
      ...customization,
      buttons: {
        ...customization.buttons,
        [buttonType]: {
          ...customization.buttons[buttonType],
          show
        }
      }
    });
  };

  // Get the current positions or default values
  const directionsPosition = customization.buttons?.directions?.position || 'bottom-right';
  const calendarPosition = customization.buttons?.calendar?.position || 'bottom-left';
  
  return (
    <Card>
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="background">Background</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
          </TabsList>
          
          <TabsContent value="background">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Background Type</Label>
                <RadioGroup
                  value={customization.background.type}
                  onValueChange={(value) => handleBackgroundTypeChange(value as BackgroundType)}
                  className="flex space-x-2"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="solid" id="bg-solid" />
                    <Label htmlFor="bg-solid">Solid</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="gradient" id="bg-gradient" />
                    <Label htmlFor="bg-gradient">Gradient</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="image" id="bg-image" />
                    <Label htmlFor="bg-image">Image</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {customization.background.type === 'solid' && (
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full flex justify-between">
                        <span>Select Color</span>
                        <div 
                          className="w-4 h-4 rounded-full border" 
                          style={{ backgroundColor: customization.background.value }}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3">
                      <HexColorPicker 
                        color={customization.background.value || '#ffffff'} 
                        onChange={handleBackgroundValueChange}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
              
              {/* Other background type controls would go here */}
            </div>
          </TabsContent>
          
          <TabsContent value="text">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={customization.font.family}
                  onValueChange={(value) => handleFontChange('family', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system-ui, sans-serif">System UI</SelectItem>
                    <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                    <SelectItem value="'Open Sans', sans-serif">Open Sans</SelectItem>
                    <SelectItem value="'Lato', sans-serif">Lato</SelectItem>
                    <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select
                  value={customization.font.size}
                  onValueChange={(value) => handleFontChange('size', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Text Color</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full flex justify-between">
                      <span>Select Color</span>
                      <div 
                        className="w-4 h-4 rounded-full border" 
                        style={{ backgroundColor: customization.font.color }}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    <HexColorPicker 
                      color={customization.font.color || '#000000'} 
                      onChange={(color) => handleFontChange('color', color)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Text Alignment</Label>
                <RadioGroup
                  value={customization.font.alignment || 'left'}
                  onValueChange={(value) => handleFontChange('alignment', value)}
                  className="flex space-x-2"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="left" id="align-left" />
                    <Label htmlFor="align-left">Left</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="center" id="align-center" />
                    <Label htmlFor="align-center">Center</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="right" id="align-right" />
                    <Label htmlFor="align-right">Right</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator className="my-4" />
              
              <TextPositionSelector
                contentPosition={customization.textLayout?.contentPosition || 'middle'}
                spacing={customization.textLayout?.spacing || 'normal'}
                onPositionChange={handleTextPositionChange}
                onSpacingChange={handleSpacingChange}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="buttons">
            <div className="space-y-4">
              {/* Basic button styling */}
              <div className="space-y-4">
                <h3 className="font-medium">Button Colors & Style</h3>
                
                <div className="space-y-2">
                  <Label>Accept Button Color</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full flex justify-between">
                        <span>Select Color</span>
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: customization.buttons?.accept?.background || '#3B82F6' }}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3">
                      <HexColorPicker
                        color={customization.buttons?.accept?.background || '#3B82F6'}
                        onChange={(color) => handleButtonStyleChange('accept', 'background', color)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>Decline Button Color</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full flex justify-between">
                        <span>Select Color</span>
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: customization.buttons?.decline?.background || '#EF4444' }}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3">
                      <HexColorPicker
                        color={customization.buttons?.decline?.background || '#EF4444'}
                        onChange={(color) => handleButtonStyleChange('decline', 'background', color)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>Button Shape</Label>
                  <Select
                    value={customization.buttons?.accept?.shape || 'rounded'}
                    onValueChange={(value) => {
                      handleButtonStyleChange('accept', 'shape', value);
                      handleButtonStyleChange('decline', 'shape', value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="pill">Pill</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Directions button settings */}
              {hasLocation && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-directions" className="text-base font-medium">Show Directions Button</Label>
                    <Switch 
                      id="show-directions" 
                      checked={customization.buttons?.directions?.show !== false}
                      onCheckedChange={(checked) => handleButtonVisibilityChange('directions', checked)}
                    />
                  </div>
                  
                  {customization.buttons?.directions?.show !== false && (
                    <ButtonPositionSelector 
                      showDirections={true}
                      onChange={(buttonType, property, value) => {
                        if (property === "position" && buttonType === "directions") {
                          handlePositionChange('directions', value as ButtonPosition);
                        }
                      }}
                      directionsButton={{
                        show: true,
                        position: directionsPosition,
                        background: customization.buttons?.directions?.background || '#3B82F6',
                        color: customization.buttons?.directions?.color || '#ffffff',
                        shape: customization.buttons?.directions?.shape || 'rounded'
                      }}
                    />
                  )}
                </div>
              )}
              
              <Separator className="my-4" />
              
              {/* Calendar button settings */}
              {isEvent && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-calendar" className="text-base font-medium">Show Calendar Button</Label>
                    <Switch 
                      id="show-calendar" 
                      checked={customization.buttons?.calendar?.show !== false}
                      onCheckedChange={(checked) => handleButtonVisibilityChange('calendar', checked)}
                    />
                  </div>
                  
                  {customization.buttons?.calendar?.show !== false && (
                    <ButtonPositionSelector 
                      showCalendar={true}
                      onChange={(buttonType, property, value) => {
                        if (property === "position" && buttonType === "calendar") {
                          handlePositionChange('calendar', value as ButtonPosition);
                        }
                      }}
                      calendarButton={{
                        show: true,
                        position: calendarPosition,
                        background: customization.buttons?.calendar?.background || '#3B82F6',
                        color: customization.buttons?.calendar?.color || '#ffffff',
                        shape: customization.buttons?.calendar?.shape || 'rounded'
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
