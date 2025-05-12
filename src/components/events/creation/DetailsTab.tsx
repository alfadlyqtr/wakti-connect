
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import LocationInput from "@/components/events/location/LocationInput";
import { TimePicker } from "@/components/ui/time-picker";
import { useIsMobile } from "@/hooks/use-mobile";

interface DetailsTabProps {
  register?: any;
  errors?: any;
  selectedDate: Date;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  location: string;
  locationTitle?: string;
  locationType?: 'manual' | 'google_maps';
  mapsUrl?: string;
  handleNextTab: () => void;
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onDateChange: (date: Date) => void;
  onLocationChange: (location: string, type?: 'manual' | 'google_maps', url?: string, title?: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onIsAllDayChange: (isAllDay: boolean) => void;
  getCurrentLocation?: () => void;
  isGettingLocation?: boolean;
  locationType?: 'manual' | 'google_maps';
  mapsUrl?: string;
  isEdit?: boolean;
  formData?: any; // Add this prop to accept formData if passed
}

const DetailsTab: React.FC<DetailsTabProps> = ({
  register,
  errors = {},
  selectedDate,
  startTime,
  endTime,
  isAllDay,
  location,
  locationTitle,
  onLocationChange,
  handleNextTab,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onIsAllDayChange,
  getCurrentLocation,
  isGettingLocation = false,
  locationType,
  mapsUrl,
  isEdit = false,
  formData // Accept formData but not use it directly, as we're using individual props
}) => {
  const isMobile = useIsMobile();
  
  const canProceedToNext = title.trim() !== '';

  return (
    <div className="px-4 py-2 space-y-6 max-w-2xl mx-auto">
      <div className="space-y-3">
        <div>
          <Label htmlFor="title" className="text-base">Event Title</Label>
          <Input 
            id="title"
            placeholder="Enter event title"
            className="w-full mt-1" 
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
          />
          {errors.title && (
            <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
          )}
          {title.trim() === '' && (
            <p className="text-sm text-amber-600 mt-1">Event title is required</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="description" className="text-base">Description (Optional)</Label>
          <Textarea 
            id="description"
            placeholder="Enter event details"
            className="w-full mt-1 min-h-[100px]"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label className="text-base">Date & Time</Label>
        <div className="mt-2 space-y-4">
          <DatePicker 
            date={selectedDate} 
            setDate={onDateChange}
            placeholder={isMobile ? "Select date" : "Select event date"}
          />
          
          <div className="flex items-center gap-2">
            <Label htmlFor="all-day" className="cursor-pointer">All-day event</Label>
            <Switch 
              id="all-day" 
              checked={isAllDay} 
              onCheckedChange={onIsAllDayChange} 
            />
          </div>
          
          {!isAllDay && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time" className="text-sm">Start Time</Label>
                <TimePicker
                  value={startTime}
                  onChange={onStartTimeChange}
                />
              </div>
              <div>
                <Label htmlFor="end-time" className="text-sm">End Time</Label>
                <TimePicker
                  value={endTime}
                  onChange={onEndTimeChange}
                  minTime={startTime}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="location" className="text-base">Location</Label>
        <div className="mt-2">
          <LocationInput
            location={location}
            locationTitle={locationTitle || ''}
            locationType={locationType}
            mapsUrl={mapsUrl}
            onChange={onLocationChange}
            getCurrentLocation={getCurrentLocation}
            isGettingLocation={isGettingLocation}
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button 
          type="button" 
          onClick={handleNextTab}
          className="px-6"
          disabled={!canProceedToNext}
        >
          Next: Customize
        </Button>
      </div>
    </div>
  );
};

export default DetailsTab;
