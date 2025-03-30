
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
import { useIsMobile } from "@/hooks/useIsMobile";

interface DetailsTabProps {
  register: any;
  errors: any;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  isAllDay: boolean;
  setIsAllDay: (isAllDay: boolean) => void;
  location: string;
  locationType: 'manual' | 'google_maps';
  mapsUrl?: string;
  handleLocationChange: (value: string, type: 'manual' | 'google_maps', mapsUrl?: string) => void;
  handleNextTab: () => void;
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  isEdit?: boolean;
}

const DetailsTab: React.FC<DetailsTabProps> = ({
  register,
  errors,
  selectedDate,
  setSelectedDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  isAllDay,
  setIsAllDay,
  location,
  locationType,
  mapsUrl,
  handleLocationChange,
  handleNextTab,
  title,
  description,
  setTitle,
  setDescription,
  isEdit = false
}) => {
  const isMobile = useIsMobile();
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

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
            onChange={handleTitleChange}
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
            onChange={handleDescriptionChange}
          />
        </div>
      </div>

      <div>
        <Label className="text-base">Date & Time</Label>
        <div className="mt-2 space-y-4">
          <DatePicker 
            date={selectedDate} 
            setDate={setSelectedDate}
            placeholder={isMobile ? "Select date" : "Select event date"}
          />
          
          <div className="flex items-center gap-2">
            <Label htmlFor="all-day" className="cursor-pointer">All-day event</Label>
            <Switch 
              id="all-day" 
              checked={isAllDay} 
              onCheckedChange={setIsAllDay} 
            />
          </div>
          
          {!isAllDay && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time" className="text-sm">Start Time</Label>
                <TimePicker
                  value={startTime}
                  onChange={setStartTime}
                />
              </div>
              <div>
                <Label htmlFor="end-time" className="text-sm">End Time</Label>
                <TimePicker
                  value={endTime}
                  onChange={setEndTime}
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
            value={location}
            onChange={(value) => handleLocationChange(value, locationType)}
            locationType={locationType}
            mapsUrl={mapsUrl}
            onLocationChange={handleLocationChange}
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
