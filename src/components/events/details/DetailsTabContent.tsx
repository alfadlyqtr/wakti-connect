
import React from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
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
  onTitleChange,
  onDescriptionChange,
  onDateChange,
  onLocationChange,
  onStartTimeChange,
  onEndTimeChange,
  onIsAllDayChange,
  isGettingLocation = false
}) => {
  const handleLocationChange = (location: string, type?: 'manual' | 'google_maps', url?: string) => {
    if (onLocationChange) {
      onLocationChange(location, type, url);
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
        <div className="space-y-2">
          <LocationPicker
            value={location}
            onChange={handleLocationChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailsTabContent;
