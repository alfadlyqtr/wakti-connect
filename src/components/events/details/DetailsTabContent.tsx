
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from 'lucide-react';
import LocationInput from '../location/LocationInput';

interface DetailsTabContentProps {
  title: string;
  description: string;
  selectedDate: Date;
  location: string;
  locationTitle: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  locationType?: 'manual' | 'google_maps';
  mapsUrl?: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onDateChange: (date: Date) => void;
  onLocationChange: (location: string, type?: 'manual' | 'google_maps', url?: string, title?: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onIsAllDayChange: (isAllDay: boolean) => void;
  getCurrentLocation?: () => void;
  isGettingLocation?: boolean;
  handleNextTab?: () => void;
}

const DetailsTabContent: React.FC<DetailsTabContentProps> = ({
  title,
  description,
  selectedDate,
  location,
  locationTitle,
  startTime,
  endTime,
  isAllDay,
  locationType = 'manual',
  mapsUrl,
  onTitleChange,
  onDescriptionChange,
  onDateChange,
  onLocationChange,
  onStartTimeChange,
  onEndTimeChange,
  onIsAllDayChange,
  getCurrentLocation,
  isGettingLocation,
  handleNextTab
}) => {
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    date?: string;
    time?: string;
  }>({});
  
  const validateForm = (): boolean => {
    const errors: {
      title?: string;
      date?: string;
      time?: string;
    } = {};
    
    // Validate title
    if (!title.trim()) {
      errors.title = 'Title is required';
    }
    
    // Validate date
    if (!selectedDate) {
      errors.date = 'Date is required';
    }
    
    // Validate time (if not all day event)
    if (!isAllDay) {
      if (!startTime) {
        errors.time = 'Start time is required';
      }
      
      if (!endTime) {
        errors.time = 'End time is required';
      }
      
      if (startTime && endTime) {
        // Compare times
        const startMinutes = convertTimeToMinutes(startTime);
        const endMinutes = convertTimeToMinutes(endTime);
        
        if (endMinutes <= startMinutes) {
          errors.time = 'End time must be after start time';
        }
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const handleNext = () => {
    if (validateForm() && handleNextTab) {
      handleNextTab();
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className={formErrors.title ? 'text-destructive' : ''}>
          Event Title *
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter event title"
          className={formErrors.title ? 'border-destructive' : ''}
        />
        {formErrors.title && <p className="text-sm text-destructive">{formErrors.title}</p>}
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Add details about your event"
          rows={4}
        />
      </div>
      
      {/* Date and Time */}
      <div className="space-y-2">
        <Label className={formErrors.date ? 'text-destructive' : ''}>
          Date *
        </Label>
        <div>
          <DatePicker 
            date={selectedDate} 
            setDate={onDateChange}
            className={formErrors.date ? 'border-destructive' : ''}
          />
          {formErrors.date && <p className="text-sm text-destructive">{formErrors.date}</p>}
        </div>
      </div>
      
      {/* All Day Switch */}
      <div className="flex items-center space-x-2">
        <Switch 
          id="all-day"
          checked={isAllDay}
          onCheckedChange={onIsAllDayChange}
        />
        <Label htmlFor="all-day">All day event</Label>
      </div>
      
      {/* Time selection (if not all day) */}
      {!isAllDay && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-time" className={formErrors.time ? 'text-destructive' : ''}>
              Start Time *
            </Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              className={formErrors.time ? 'border-destructive' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-time" className={formErrors.time ? 'text-destructive' : ''}>
              End Time *
            </Label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              className={formErrors.time ? 'border-destructive' : ''}
            />
          </div>
          {formErrors.time && (
            <p className="text-sm text-destructive col-span-2">{formErrors.time}</p>
          )}
        </div>
      )}
      
      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <LocationInput
          location={location}
          locationTitle={locationTitle}
          locationType={locationType}
          mapsUrl={mapsUrl}
          onChange={onLocationChange}
          getCurrentLocation={getCurrentLocation}
          isGettingLocation={isGettingLocation}
        />
      </div>
      
      {/* Next button */}
      {handleNextTab && (
        <div className="pt-4 flex justify-end">
          <Button 
            type="button" 
            onClick={handleNext}
            className="px-6"
          >
            Next: Customize
            <Calendar className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DetailsTabContent;
