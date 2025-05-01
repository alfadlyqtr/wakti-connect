
import React from 'react';
import { 
  ButtonPosition, 
  ButtonShape 
} from '@/types/invitation.types';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  AlertCircle,
  Calendar,
  Map,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HexColorPicker } from '@/components/ui/color-picker';

interface DirectionsButtonProps {
  background: string;
  color: string;
  shape: ButtonShape;
  position: ButtonPosition;
  show: boolean;
}

interface CalendarButtonProps {
  background: string;
  color: string;
  shape: ButtonShape;
  position: ButtonPosition;
  show: boolean;
}

interface ButtonStylerProps {
  buttons?: {
    directions?: DirectionsButtonProps;
    calendar?: CalendarButtonProps;
  };
  onButtonChange: (
    buttonType: 'directions' | 'calendar',
    property: 'background' | 'color' | 'shape' | 'position' | 'show',
    value: string | boolean
  ) => void;
  hasLocation?: boolean;
  isEvent?: boolean;
}

export default function ButtonStyler({ 
  buttons = {}, 
  onButtonChange,
  hasLocation = false,
  isEvent = false
}: ButtonStylerProps) {
  // Default button configurations
  const directionsButton = buttons.directions || {
    background: '#ffffff',
    color: '#000000',
    shape: 'rounded' as ButtonShape,
    position: 'bottom-right' as ButtonPosition,
    show: true
  };
  
  const calendarButton = buttons.calendar || {
    background: '#ffffff',
    color: '#000000',
    shape: 'rounded' as ButtonShape,
    position: 'bottom-left' as ButtonPosition,
    show: true
  };

  // Position display mapping
  const positionDisplayMap = {
    'bottom-left': 'Bottom Left',
    'bottom-center': 'Bottom Center',
    'bottom-right': 'Bottom Right',
    'top-right': 'Top Right'
  };

  // Shape display mapping
  const shapeDisplayMap = {
    'rounded': 'Rounded',
    'pill': 'Pill',
    'square': 'Square'
  };

  // Position icon mapping
  const positionIconMap = {
    'bottom-left': <ArrowDownLeft className="h-4 w-4" />,
    'bottom-center': <Map className="h-4 w-4" />,
    'bottom-right': <ArrowDownRight className="h-4 w-4" />,
    'top-right': <ArrowUpRight className="h-4 w-4" />
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="directions">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="directions">Directions Button</TabsTrigger>
          <TabsTrigger value="calendar">Calendar Button</TabsTrigger>
        </TabsList>

        <TabsContent value="directions" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-directions" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                Show Get Directions Button
              </Label>
              <Switch 
                id="show-directions" 
                checked={directionsButton.show}
                onCheckedChange={(checked) => onButtonChange('directions', 'show', checked)}
                disabled={!hasLocation}
              />
            </div>

            {!hasLocation && (
              <div className="text-sm flex items-center gap-2 text-amber-500">
                <AlertCircle className="h-4 w-4" />
                Add a location to enable directions button
              </div>
            )}

            {hasLocation && directionsButton.show && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Button Position</Label>
                  <RadioGroup
                    value={directionsButton.position}
                    onValueChange={(value) => onButtonChange('directions', 'position', value as ButtonPosition)}
                    className="grid grid-cols-2 gap-2"
                  >
                    {Object.entries(positionDisplayMap).map(([value, label]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={`directions-pos-${value}`} />
                        <Label htmlFor={`directions-pos-${value}`} className="flex items-center gap-1 cursor-pointer">
                          {positionIconMap[value as keyof typeof positionIconMap]}
                          {label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="directions-bg-color">Background Color</Label>
                    <div className="mt-1.5">
                      <Input
                        id="directions-bg-color"
                        type="color"
                        value={directionsButton.background}
                        onChange={(e) => onButtonChange('directions', 'background', e.target.value)}
                        className="h-10 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="directions-text-color">Text Color</Label>
                    <div className="mt-1.5">
                      <Input
                        id="directions-text-color"
                        type="color"
                        value={directionsButton.color}
                        onChange={(e) => onButtonChange('directions', 'color', e.target.value)}
                        className="h-10 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="directions-shape">Button Shape</Label>
                  <Select 
                    value={directionsButton.shape} 
                    onValueChange={(value) => onButtonChange('directions', 'shape', value as ButtonShape)}
                  >
                    <SelectTrigger id="directions-shape" className="w-full">
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(shapeDisplayMap).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted/50 rounded-md">
                  <h4 className="text-sm font-medium mb-3">Preview</h4>
                  <div className="flex justify-center">
                    <Card className="relative w-full aspect-[3/4] p-4 flex items-center justify-center">
                      <button
                        className="absolute px-3 py-1 text-xs flex items-center gap-1"
                        style={{
                          backgroundColor: directionsButton.background,
                          color: directionsButton.color,
                          borderRadius: directionsButton.shape === 'rounded' ? '0.375rem' : 
                                        directionsButton.shape === 'pill' ? '9999px' : '0',
                          bottom: directionsButton.position.startsWith('bottom') ? '10px' : 'auto',
                          top: directionsButton.position.startsWith('top') ? '10px' : 'auto',
                          left: directionsButton.position.endsWith('left') ? '10px' : 'auto',
                          right: directionsButton.position.endsWith('right') ? '10px' : 'auto',
                          transform: directionsButton.position === 'bottom-center' ? 'translateX(-50%)' : 'none',
                        }}
                      >
                        <Map className="h-3 w-3" />
                        Get Directions
                      </button>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Show Add to Calendar Button
              </Label>
              <Switch 
                id="show-calendar" 
                checked={calendarButton.show}
                onCheckedChange={(checked) => onButtonChange('calendar', 'show', checked)}
              />
            </div>

            {calendarButton.show && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Button Position</Label>
                  <RadioGroup
                    value={calendarButton.position}
                    onValueChange={(value) => onButtonChange('calendar', 'position', value as ButtonPosition)}
                    className="grid grid-cols-2 gap-2"
                  >
                    {Object.entries(positionDisplayMap).map(([value, label]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={`calendar-pos-${value}`} />
                        <Label htmlFor={`calendar-pos-${value}`} className="flex items-center gap-1 cursor-pointer">
                          {positionIconMap[value as keyof typeof positionIconMap]}
                          {label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="calendar-bg-color">Background Color</Label>
                    <div className="mt-1.5">
                      <Input
                        id="calendar-bg-color"
                        type="color"
                        value={calendarButton.background}
                        onChange={(e) => onButtonChange('calendar', 'background', e.target.value)}
                        className="h-10 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="calendar-text-color">Text Color</Label>
                    <div className="mt-1.5">
                      <Input
                        id="calendar-text-color"
                        type="color"
                        value={calendarButton.color}
                        onChange={(e) => onButtonChange('calendar', 'color', e.target.value)}
                        className="h-10 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="calendar-shape">Button Shape</Label>
                  <Select 
                    value={calendarButton.shape} 
                    onValueChange={(value) => onButtonChange('calendar', 'shape', value as ButtonShape)}
                  >
                    <SelectTrigger id="calendar-shape" className="w-full">
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(shapeDisplayMap).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted/50 rounded-md">
                  <h4 className="text-sm font-medium mb-3">Preview</h4>
                  <div className="flex justify-center">
                    <Card className="relative w-full aspect-[3/4] p-4 flex items-center justify-center">
                      <button
                        className="absolute px-3 py-1 text-xs flex items-center gap-1"
                        style={{
                          backgroundColor: calendarButton.background,
                          color: calendarButton.color,
                          borderRadius: calendarButton.shape === 'rounded' ? '0.375rem' : 
                                        calendarButton.shape === 'pill' ? '9999px' : '0',
                          bottom: calendarButton.position.startsWith('bottom') ? '10px' : 'auto',
                          top: calendarButton.position.startsWith('top') ? '10px' : 'auto',
                          left: calendarButton.position.endsWith('left') ? '10px' : 'auto',
                          right: calendarButton.position.endsWith('right') ? '10px' : 'auto',
                          transform: calendarButton.position === 'bottom-center' ? 'translateX(-50%)' : 'none',
                        }}
                      >
                        <Calendar className="h-3 w-3" />
                        Add to Calendar
                      </button>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
