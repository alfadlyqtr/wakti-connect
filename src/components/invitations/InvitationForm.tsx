
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CalendarIcon, MapPin } from 'lucide-react';

interface InvitationFormProps {
  formData: {
    title: string;
    description: string;
    location: string;
    locationTitle: string;
    date: string;
    time: string;
  };
  onChange: (field: string, value: string) => void;
  className?: string;
}

export default function InvitationForm({ 
  formData, 
  onChange, 
  className 
}: InvitationFormProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <Label htmlFor="title">Invitation Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Enter a title for your invitation"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Describe your event or invitation"
          className="mt-1 min-h-[100px]"
        />
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <div className="flex items-center mt-1">
          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => onChange('date', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          type="time"
          value={formData.time}
          onChange={(e) => onChange('time', e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="locationTitle">Location Name</Label>
        <Input
          id="locationTitle"
          value={formData.locationTitle}
          onChange={(e) => onChange('locationTitle', e.target.value)}
          placeholder="e.g. Central Park, My Home, etc."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="location" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" /> Google Maps Location
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => onChange('location', e.target.value)}
          placeholder="Paste Google Maps link"
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Paste a Google Maps URL for directions
        </p>
      </div>
    </div>
  );
}
