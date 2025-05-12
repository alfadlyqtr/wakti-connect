
import React from 'react';
import { useCustomization } from '../context';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, QrCode } from 'lucide-react';

const FeaturesTabContent: React.FC = () => {
  const { 
    customization, 
    handleToggleCalendar, 
    handleToggleButtons, 
    handleMapDisplayChange,
    handleUtilityButtonStyleChange,
    handlePoweredByColorChange
  } = useCustomization();
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-medium mb-4">Feature Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="toggle-buttons" className="text-sm font-medium">Show Accept/Decline Buttons</Label>
              <p className="text-xs text-muted-foreground">Allow guests to respond to your invitation</p>
            </div>
            <Switch 
              id="toggle-buttons" 
              checked={customization.showAcceptDeclineButtons !== false}
              onCheckedChange={handleToggleButtons || (() => {})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="toggle-calendar" className="text-sm font-medium">Show Add to Calendar Button</Label>
              <p className="text-xs text-muted-foreground">Allow guests to add the event to their calendar</p>
            </div>
            <Switch 
              id="toggle-calendar" 
              checked={customization.showAddToCalendarButton !== false}
              onCheckedChange={handleToggleCalendar || (() => {})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="map-display" className="text-sm font-medium">Map Display</Label>
              <p className="text-xs text-muted-foreground">Choose how to display location information</p>
            </div>
            <Select 
              value={customization.mapDisplay || 'button'} 
              onValueChange={handleMapDisplayChange || (() => {})}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Map Display" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="button">Button Only</SelectItem>
                <SelectItem value="both">Button & Map</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-base font-medium mb-4">Powered by Text</h3>
        <div className="flex gap-3 items-center">
          <Label htmlFor="powered-by-color" className="whitespace-nowrap">Color:</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="color"
              id="powered-by-color"
              value={customization.poweredByColor || '#777777'}
              onChange={(e) => handlePoweredByColorChange && handlePoweredByColorChange(e.target.value)}
              className="w-10 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={customization.poweredByColor || '#777777'}
              onChange={(e) => handlePoweredByColorChange && handlePoweredByColorChange(e.target.value)}
              className="flex-1 max-w-36"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-muted/50 p-4 rounded-md text-center text-sm text-muted-foreground">
        Additional feature customization options will be available in future updates.
      </div>
    </div>
  );
};

export default FeaturesTabContent;
