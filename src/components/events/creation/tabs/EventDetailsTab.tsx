
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, MapPin, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";

interface EventDetailsTabProps {
  title: string;
  description: string;
  selectedDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  locationTitle?: string;
  isAllDay: boolean;
  locationType?: 'manual' | 'google_maps';
  mapsUrl?: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onDateChange: (date: Date) => void;
  onStartTimeChange: (startTime: string) => void;
  onEndTimeChange: (endTime: string) => void;
  onLocationChange: (
    location: string, 
    locationType?: 'manual' | 'google_maps', 
    mapsUrl?: string,
    title?: string
  ) => void;
  onIsAllDayChange: (isAllDay: boolean) => void;
  getCurrentLocation: () => void;
  isGettingLocation: boolean;
  handleNextTab?: () => void;
}

const EventDetailsTab: React.FC<EventDetailsTabProps> = ({
  title,
  description,
  selectedDate,
  startTime,
  endTime,
  location,
  locationTitle,
  isAllDay,
  locationType,
  mapsUrl,
  onTitleChange,
  onDescriptionChange,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onLocationChange,
  onIsAllDayChange,
  getCurrentLocation,
  isGettingLocation,
  handleNextTab,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-base">Event Title</Label>
          <Input
            id="title"
            placeholder="Enter event title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-base">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter event description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={4}
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-medium">Date & Time</h3>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className="w-full justify-start text-left font-normal mt-1.5"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && onDateChange(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="all-day-event"
                checked={isAllDay}
                onCheckedChange={onIsAllDayChange}
              />
              <Label htmlFor="all-day-event">All day event</Label>
            </div>
          </div>
        </div>

        {!isAllDay && (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => onStartTimeChange(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => onEndTimeChange(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-medium">Location</h3>

        <div>
          <Label htmlFor="location-title">Location Name (Optional)</Label>
          <Input
            id="location-title"
            placeholder="e.g., Company HQ, Conference Center"
            value={locationTitle || ""}
            onChange={(e) => onLocationChange(location, locationType, mapsUrl, e.target.value)}
            className="mt-1.5"
          />
          <p className="text-sm text-muted-foreground mt-1">
            A descriptive name for the location
          </p>
        </div>
        
        <div>
          <Label htmlFor="location">Address</Label>
          <div className="flex mt-1.5">
            <Input
              id="location"
              placeholder="Enter location address"
              value={location}
              onChange={(e) => onLocationChange(e.target.value, locationType, mapsUrl, locationTitle)}
              className="rounded-r-none"
            />
            <Button 
              type="button" 
              variant="outline" 
              className="rounded-l-none px-3 border-l-0"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {handleNextTab && (
        <div className="flex justify-end mt-6">
          <Button type="button" onClick={handleNextTab}>
            Next: Customize <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventDetailsTab;
