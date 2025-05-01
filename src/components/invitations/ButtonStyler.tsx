
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { ButtonPosition, ButtonShape, SimpleInvitationCustomization } from '@/types/invitation.types';
import { Card } from '@/components/ui/card';
import { MapPin, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ButtonStylerProps {
  buttons?: SimpleInvitationCustomization['buttons'];
  onButtonChange: (
    buttonType: 'directions' | 'calendar',
    property: 'background' | 'color' | 'shape' | 'position' | 'show',
    value: string | boolean
  ) => void;
  hasLocation?: boolean;
  isEvent?: boolean;
}

export default function ButtonStyler({ 
  buttons, 
  onButtonChange,
  hasLocation = false,
  isEvent = false
}: ButtonStylerProps) {
  // Default values for buttons
  const directionsButton = buttons?.directions || {
    background: '#ffffff',
    color: '#000000',
    shape: 'rounded' as ButtonShape,
    position: 'bottom-right' as ButtonPosition,
    show: true
  };
  
  const calendarButton = buttons?.calendar || {
    background: '#ffffff',
    color: '#000000',
    shape: 'rounded' as ButtonShape,
    position: 'bottom-right' as ButtonPosition,
    show: true
  };

  // Get CSS classes based on button shape
  const getButtonClasses = (shape: ButtonShape) => {
    const baseClass = "px-4 py-2 text-sm font-medium";
    
    switch(shape) {
      case 'pill':
        return `${baseClass} rounded-full`;
      case 'square':
        return `${baseClass} rounded-none`;
      case 'rounded':
      default:
        return `${baseClass} rounded-md`;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={hasLocation ? "directions" : "calendar"}>
        <TabsList className="w-full">
          {hasLocation && <TabsTrigger value="directions">Get Directions</TabsTrigger>}
          {isEvent && <TabsTrigger value="calendar">Add to Calendar</TabsTrigger>}
        </TabsList>
        
        {hasLocation && (
          <TabsContent value="directions" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-directions">Show Get Directions Button</Label>
              <Switch 
                id="show-directions" 
                checked={directionsButton.show}
                onCheckedChange={(checked) => onButtonChange('directions', 'show', checked)}
              />
            </div>
            
            {directionsButton.show && (
              <>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Background Color</Label>
                      <div className="flex gap-2 items-center">
                        <Input 
                          type="color" 
                          value={directionsButton.background} 
                          onChange={(e) => onButtonChange('directions', 'background', e.target.value)} 
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input 
                          type="text" 
                          value={directionsButton.background} 
                          onChange={(e) => onButtonChange('directions', 'background', e.target.value)} 
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Text Color</Label>
                      <div className="flex gap-2 items-center">
                        <Input 
                          type="color" 
                          value={directionsButton.color} 
                          onChange={(e) => onButtonChange('directions', 'color', e.target.value)} 
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input 
                          type="text" 
                          value={directionsButton.color} 
                          onChange={(e) => onButtonChange('directions', 'color', e.target.value)} 
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Button Shape</Label>
                    <RadioGroup 
                      value={directionsButton.shape} 
                      onValueChange={(value) => onButtonChange('directions', 'shape', value as ButtonShape)}
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="directions-position">Button Position</Label>
                    <Select 
                      value={directionsButton.position} 
                      onValueChange={(value) => onButtonChange('directions', 'position', value as ButtonPosition)}
                    >
                      <SelectTrigger id="directions-position">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="bottom-center">Bottom Center</SelectItem>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Button Preview */}
                  <div className="pt-4">
                    <Label>Preview</Label>
                    <Card className="mt-2 p-4 flex items-center justify-center">
                      <button
                        className={getButtonClasses(directionsButton.shape)}
                        style={{ 
                          backgroundColor: directionsButton.background, 
                          color: directionsButton.color 
                        }}
                      >
                        <MapPin className="h-4 w-4 mr-1 inline-block" /> Get Directions
                      </button>
                    </Card>
                  </div>
                </>
              )}
          </TabsContent>
        )}
        
        {isEvent && (
          <TabsContent value="calendar" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-calendar">Show Add to Calendar Button</Label>
              <Switch 
                id="show-calendar" 
                checked={calendarButton.show}
                onCheckedChange={(checked) => onButtonChange('calendar', 'show', checked)}
              />
            </div>
            
            {calendarButton.show && (
              <>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Background Color</Label>
                      <div className="flex gap-2 items-center">
                        <Input 
                          type="color" 
                          value={calendarButton.background} 
                          onChange={(e) => onButtonChange('calendar', 'background', e.target.value)} 
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input 
                          type="text" 
                          value={calendarButton.background} 
                          onChange={(e) => onButtonChange('calendar', 'background', e.target.value)} 
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Text Color</Label>
                      <div className="flex gap-2 items-center">
                        <Input 
                          type="color" 
                          value={calendarButton.color} 
                          onChange={(e) => onButtonChange('calendar', 'color', e.target.value)} 
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input 
                          type="text" 
                          value={calendarButton.color} 
                          onChange={(e) => onButtonChange('calendar', 'color', e.target.value)} 
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Button Shape</Label>
                    <RadioGroup 
                      value={calendarButton.shape} 
                      onValueChange={(value) => onButtonChange('calendar', 'shape', value as ButtonShape)}
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="calendar-position">Button Position</Label>
                    <Select 
                      value={calendarButton.position} 
                      onValueChange={(value) => onButtonChange('calendar', 'position', value as ButtonPosition)}
                    >
                      <SelectTrigger id="calendar-position">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="bottom-center">Bottom Center</SelectItem>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Button Preview */}
                  <div className="pt-4">
                    <Label>Preview</Label>
                    <Card className="mt-2 p-4 flex items-center justify-center">
                      <button
                        className={getButtonClasses(calendarButton.shape)}
                        style={{ 
                          backgroundColor: calendarButton.background, 
                          color: calendarButton.color 
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-1 inline-block" /> Add to Calendar
                      </button>
                    </Card>
                  </div>
                </>
              )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
