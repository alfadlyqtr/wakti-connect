
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import LocationPicker from '@/components/events/location/LocationPicker';

interface FormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  locationTitle: string;
}

interface InvitationFormProps {
  formData: FormData;
  onChange: (field: string, value: string) => void;
  isEvent?: boolean;
}

export default function InvitationForm({ formData, onChange, isEvent = false }: InvitationFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.name, e.target.value);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      onChange('date', format(date, 'yyyy-MM-dd'));
    }
  };

  const handleLocationChange = (location: string, locationTitle: string) => {
    onChange('location', location);
    onChange('locationTitle', locationTitle);
  };

  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder={`Enter ${isEvent ? 'event' : 'invitation'} title`}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter a description"
          rows={5}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <DatePicker 
            date={formData.date ? new Date(formData.date) : undefined}
            setDate={handleDateChange}
            placeholder="Select a date"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleInputChange}
            placeholder="Select a time"
          />
        </div>
      </div>

      <LocationPicker
        location={formData.location}
        locationTitle={formData.locationTitle}
        onLocationChange={handleLocationChange}
      />
    </form>
  );
}
