import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimpleInvitationCustomization, BackgroundType, ButtonPosition } from '@/types/invitation.types';
import { HexColorPicker } from '@/components/ui/color-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import ButtonPositionSelector from './ButtonPositionSelector';
import TextPositionSelector from './TextPositionSelector';
import FontSelector from './FontSelector';

interface InvitationStylerProps {
  customization: SimpleInvitationCustomization;
  onChange: (customization: SimpleInvitationCustomization) => void;
  title?: string;
  description?: string;
}

export default function InvitationStyler({
  customization,
  onChange,
  title,
  description,
}: InvitationStylerProps) {
  const [activeTab, setActiveTab] = useState('background');
  
  const handleBackgroundChange = (type: BackgroundType, value: string) => {
    onChange({
      ...customization,
      background: {
        ...customization.background,
        type,
        value,
      },
    });
  };
  
  const handleFontChange = (property: string, value: string) => {
    onChange({
      ...customization,
      font: {
        ...customization.font,
        [property]: value,
      },
    });
  };

  const handleButtonToggle = (buttonType: 'directions' | 'calendar', enabled: boolean) => {
    // Initialize buttons object if it doesn't exist
    const buttons = customization.buttons || {
      accept: { background: '#4CAF50', color: '#ffffff', shape: 'rounded' },
      decline: { background: '#f44336', color: '#ffffff', shape: 'rounded' },
      directions: { background: '#ffffff', color: '#000000', shape: 'rounded', position: 'bottom-right', show: false },
      calendar: { background: '#ffffff', color: '#000000', shape: 'rounded', position: 'bottom-right', show: false },
    };

    onChange({
      ...customization,
      buttons: {
        ...buttons,
        [buttonType]: {
          ...buttons[buttonType],
          show: enabled,
        },
      },
    });
  };

  const handleButtonStyleChange = (
    buttonType: 'directions' | 'calendar',
    property: 'background' | 'color' | 'shape',
    value: string
  ) => {
    // Initialize buttons object if it doesn't exist
    const buttons = customization.buttons || {
      accept: { background: '#4CAF50', color: '#ffffff', shape: 'rounded' },
      decline: { background: '#f44336', color: '#ffffff', shape: 'rounded' },
      directions: { background: '#ffffff', color: '#000000', shape: 'rounded', position: 'bottom-right', show: false },
      calendar: { background: '#ffffff', color: '#000000', shape: 'rounded', position: 'bottom-right', show: false },
    };

    onChange({
      ...customization,
      buttons: {
        ...buttons,
        [buttonType]: {
          ...buttons[buttonType],
          [property]: value,
        },
      },
    });
  };

  const handleButtonPositionChange = (buttonType: 'directions' | 'calendar', position: string) => {
    // Initialize buttons object if it doesn't exist
    const buttons = customization.buttons || {
      accept: { background: '#4CAF50', color: '#ffffff', shape: 'rounded' },
      decline: { background: '#f44336', color: '#ffffff', shape: 'rounded' },
      directions: { background: '#ffffff', color: '#000000', shape: 'rounded', position: 'bottom-right', show: false },
      calendar: { background: '#ffffff', color: '#000000', shape: 'rounded', position: 'bottom-right', show: false },
    };

    onChange({
      ...customization,
      buttons: {
        ...buttons,
        [buttonType]: {
          ...buttons[buttonType],
          position,
        },
      },
    });
  };

  const handleTextLayoutChange = (property: 'contentPosition' | 'spacing', value: string) => {
    // Initialize textLayout if it doesn't exist
    const textLayout = customization.textLayout || { contentPosition: 'middle', spacing: 'normal' };
    
    onChange({
      ...customization,
      textLayout: {
        ...textLayout,
        [property]: value,
      },
    });
  };

  // Initialize button objects if they don't exist
  const directionsButton = customization.buttons?.directions || { 
    background: '#ffffff', 
    color: '#000000',
    shape: 'rounded',
    position: 'bottom-right',
    show: false 
  };
  
  const calendarButton = customization.buttons?.calendar || { 
    background: '#ffffff', 
    color: '#000000',
    shape: 'rounded',
    position: 'bottom-right',
    show: false 
  };

  // Initialize text layout if it doesn't exist
  const textLayout = customization.textLayout || {
    contentPosition: 'middle',
    spacing: 'normal',
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger value="background">Background</TabsTrigger>
          <TabsTrigger value="text">Text & Font</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
        </TabsList>

        <TabsContent value="background" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label className="block mb-2">Background Type</Label>
              <RadioGroup
                value={customization.background.type}
                onValueChange={(value) => handleBackgroundChange(value as BackgroundType, customization.background.value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="solid" id="solid" />
                  <Label htmlFor="solid">Solid Color</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gradient" id="gradient" />
                  <Label htmlFor="gradient">Gradient</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="image" />
                  <Label htmlFor="image">Image</Label>
                </div>
              </RadioGroup>
            </div>

            {customization.background.type === 'solid' && (
              <HexColorPicker
                color={customization.background.value}
                onChange={(color) => handleBackgroundChange('solid', color)}
                label="Background Color"
              />
            )}

            {customization.background.type === 'gradient' && (
              <div className="space-y-4">
                <Label className="block mb-2">Gradient</Label>
                <Select
                  value={customization.background.value}
                  onValueChange={(value) => handleBackgroundChange('gradient', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a gradient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear-gradient(to right, #ff8177, #ff867a)">Warm Sunset</SelectItem>
                    <SelectItem value="linear-gradient(to right, #4facfe, #00f2fe)">Blue Ocean</SelectItem>
                    <SelectItem value="linear-gradient(to right, #43e97b, #38f9d7)">Green Meadow</SelectItem>
                    <SelectItem value="linear-gradient(to right, #fa709a, #fee140)">Pink Lemonade</SelectItem>
                    <SelectItem value="linear-gradient(to right, #6a11cb, #2575fc)">Purple Rain</SelectItem>
                    <SelectItem value="linear-gradient(to right, #434343, #000000)">Dark Night</SelectItem>
                    <SelectItem value="linear-gradient(to right, #f6d365, #fda085)">Golden Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {customization.background.type === 'image' && (
              <div className="space-y-4">
                <Label className="block mb-2">Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={customization.background.value}
                    onChange={(e) => handleBackgroundChange('image', e.target.value)}
                    placeholder="Enter image URL"
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" className="shrink-0" type="button">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter a URL to an image or upload one.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="text" className="space-y-6">
          <div className="space-y-4">
            {/* Font Selection */}
            <FontSelector 
              font={customization.font} 
              onFontChange={handleFontChange} 
              showAlignment={true} 
              showWeight={true}
              previewText={title || "Your Invitation Title"}
            />

            {/* Text Position */}
            <TextPositionSelector 
              contentPosition={textLayout.contentPosition}
              spacing={textLayout.spacing}
              onPositionChange={(position) => handleTextLayoutChange('contentPosition', position)}
              onSpacingChange={(spacing) => handleTextLayoutChange('spacing', spacing)}
            />
          </div>
        </TabsContent>

        <TabsContent value="buttons" className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-4 p-4 border rounded-md">
              <div className="flex items-center justify-between">
                <Label htmlFor="directions-toggle" className="font-medium">
                  Show Directions Button
                </Label>
                <Switch 
                  id="directions-toggle"
                  checked={directionsButton.show}
                  onCheckedChange={(checked) => handleButtonToggle('directions', checked)}
                />
              </div>
              
              {directionsButton.show && (
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Button Appearance</Label>
                    <div className="flex gap-2 mt-1">
                      <HexColorPicker
                        color={directionsButton.background}
                        onChange={(color) => handleButtonStyleChange('directions', 'background', color)}
                        label="Background"
                      />
                      <HexColorPicker
                        color={directionsButton.color}
                        onChange={(color) => handleButtonStyleChange('directions', 'color', color)}
                        label="Text Color"
                      />
                    </div>
                    
                    <div className="mt-4">
                      <Label className="block mb-2">Button Shape</Label>
                      <RadioGroup 
                        value={directionsButton.shape}
                        onValueChange={(value) => handleButtonStyleChange('directions', 'shape', value)}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="rounded" id="directions-rounded" />
                          <Label htmlFor="directions-rounded">Rounded</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pill" id="directions-pill" />
                          <Label htmlFor="directions-pill">Pill</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="square" id="directions-square" />
                          <Label htmlFor="directions-square">Square</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <ButtonPositionSelector
                    position={directionsButton.position as ButtonPosition}
                    onPositionChange={(position: ButtonPosition) => {
                      handleButtonStyleChange('directions', 'position', position);
                    }}
                    onChange={(buttonType, property, value) => {
                      handleButtonStyleChange(buttonType, property, value);
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4 p-4 border rounded-md">
              <div className="flex items-center justify-between">
                <Label htmlFor="calendar-toggle" className="font-medium">
                  Show Calendar Button
                </Label>
                <Switch 
                  id="calendar-toggle"
                  checked={calendarButton.show}
                  onCheckedChange={(checked) => handleButtonToggle('calendar', checked)}
                />
              </div>
              
              {calendarButton.show && (
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Button Appearance</Label>
                    <div className="flex gap-2 mt-1">
                      <HexColorPicker
                        color={calendarButton.background}
                        onChange={(color) => handleButtonStyleChange('calendar', 'background', color)}
                        label="Background"
                      />
                      <HexColorPicker
                        color={calendarButton.color}
                        onChange={(color) => handleButtonStyleChange('calendar', 'color', color)}
                        label="Text Color"
                      />
                    </div>
                    
                    <div className="mt-4">
                      <Label className="block mb-2">Button Shape</Label>
                      <RadioGroup 
                        value={calendarButton.shape}
                        onValueChange={(value) => handleButtonStyleChange('calendar', 'shape', value)}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="rounded" id="calendar-rounded" />
                          <Label htmlFor="calendar-rounded">Rounded</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pill" id="calendar-pill" />
                          <Label htmlFor="calendar-pill">Pill</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="square" id="calendar-square" />
                          <Label htmlFor="calendar-square">Square</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <ButtonPositionSelector
                    position={calendarButton.position as ButtonPosition}
                    onPositionChange={(position: ButtonPosition) => {
                      handleButtonStyleChange('calendar', 'position', position);
                    }}
                    onChange={(buttonType, property, value) => {
                      handleButtonStyleChange(buttonType, property, value);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
