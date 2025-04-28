import React, { useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, MapPin, Navigation } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LocationPicker from "../location/LocationPicker";

interface DetailsTabContentProps {
  title?: string;
  description?: string;
  selectedDate?: Date;
  location?: string;
  startTime?: string;
  endTime?: string;
  isAllDay?: boolean;
  locationType?: 'manual' | 'google_maps';
  mapsUrl?: string;
  onTitleChange?: (title: string) => void;
  onDescriptionChange?: (description: string) => void;
  onDateChange?: (date: Date) => void;
  onLocationChange?: (location: string, type?: 'manual' | 'google_maps', url?: string) => void;
  onStartTimeChange?: (time: string) => void;
  onEndTimeChange?: (time: string) => void;
  onIsAllDayChange?: (isAllDay: boolean) => void;
  getCurrentLocation?: () => void;
  isGettingLocation?: boolean;
}

const DetailsTabContent: React.FC<DetailsTabContentProps> = ({
  title = "",
  description = "",
  selectedDate = new Date(),
  location = "",
  startTime = "09:00",
  endTime = "10:00",
  isAllDay = false,
  locationType = 'manual',
  mapsUrl = "",
  onTitleChange,
  onDescriptionChange,
  onDateChange,
  onLocationChange,
  onStartTimeChange,
  onEndTimeChange,
  onIsAllDayChange,
  getCurrentLocation,
  isGettingLocation
}) => {
  const [locationInputType, setLocationInputType] = useState<'manual' | 'maps'>(locationType === 'google_maps' ? 'maps' : 'manual');
  
  const handleLocationTypeChange = (value: 'manual' | 'maps') => {
    setLocationInputType(value);
    // Reset location when changing type
    if (value === 'manual' && onLocationChange) {
      onLocationChange("", 'manual');
    }
  };

  const handleLocationChange = (value: string, lat?: number, lng?: number) => {
    if (onLocationChange) {
      const url = lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : undefined;
      onLocationChange(value, 'google_maps', url);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={(e) => onTitleChange?.(e.target.value)}
          placeholder="Enter event title" 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={(e) => onDescriptionChange?.(e.target.value)}
          placeholder="Enter event description" 
          rows={3} 
        />
      </div>

      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateChange?.(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="isAllDay"
          checked={isAllDay}
          onCheckedChange={onIsAllDayChange}
        />
        <Label htmlFor="isAllDay">All day event</Label>
      </div>

      {!isAllDay && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => onStartTimeChange?.(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => onEndTimeChange?.(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <Label>Location</Label>
        
        <RadioGroup 
          value={locationInputType} 
          onValueChange={(v) => handleLocationTypeChange(v as 'manual' | 'maps')}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="manual" id="manual" />
            <Label htmlFor="manual">Manual entry</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="maps" id="maps" />
            <Label htmlFor="maps">Google Maps</Label>
          </div>
        </RadioGroup>
        
        {locationInputType === 'manual' ? (
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Input
              value={location}
              onChange={(e) => onLocationChange?.(e.target.value, 'manual')}
              placeholder="Enter location manually"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <LocationPicker
              value={location}
              onChange={handleLocationChange}
              placeholder="Search for a location..."
            />
            
            {getCurrentLocation && !isGettingLocation && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                className="w-full" 
                onClick={getCurrentLocation}
              >
                <Navigation className="mr-2 h-4 w-4" />
                Use my current location
              </Button>
            )}
            
            {isGettingLocation && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                className="w-full" 
                disabled={true}
              >
                <Navigation className="mr-2 h-4 w-4 animate-pulse" />
                Getting your location...
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsTabContent;
