
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BackgroundType, ButtonShape, EventFormTab } from '@/types/event.types';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import CalendarIntegrationButtons from '../calendar/CalendarIntegrationButtons';

interface EventCreationFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

const EventCreationForm: React.FC<EventCreationFormProps> = ({ onCancel, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<EventFormTab>("details");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(() => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    return date;
  });
  const [isAllDay, setIsAllDay] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [locationTitle, setLocationTitle] = useState("");
  const [locationType, setLocationType] = useState<'manual' | 'google_maps'>('manual');
  const [mapsUrl, setMapsUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Default customization state
  const [customization, setCustomization] = useState({
    background: {
      type: 'solid' as BackgroundType,
      value: '#ffffff',
    },
    font: {
      family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      size: 'medium',
      color: '#333333',
      weight: 'normal',
      alignment: 'left'
    },
    buttons: {
      accept: {
        background: '#4CAF50',
        color: '#ffffff',
        shape: 'rounded' as ButtonShape,
      },
      decline: {
        background: '#f44336',
        color: '#ffffff',
        shape: 'rounded' as ButtonShape,
      }
    }
  });

  const handleLocationChange = (
    newLocation: string,
    type?: 'manual' | 'google_maps',
    url?: string,
    title?: string
  ) => {
    setLocation(newLocation);
    if (type) setLocationType(type);
    if (url) setMapsUrl(url);
    if (title !== undefined) setLocationTitle(title);
  };

  const handleCustomizationChange = (newCustomization: any) => {
    setCustomization(newCustomization);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare event data
    const eventData = {
      title,
      description,
      startDate,
      endDate,
      isAllDay,
      location,
      location_title: locationTitle,
      customization
    };
    
    // Mock submission (replace with actual API call)
    setTimeout(() => {
      console.log('Submitting event:', eventData);
      
      // Show success message
      toast({
        title: "Success!",
        description: "Your event has been created",
      });
      
      // Reset form or redirect
      if (onSuccess) {
        onSuccess();
      }
      
      setIsSubmitting(false);
    }, 1000);
  };
  
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
              />
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details about your event"
                rows={4}
              />
            </div>
            
            {/* Date and Time */}
            <div className="space-y-2">
              <Label>Date *</Label>
              <div>
                <DatePicker 
                  date={startDate} 
                  setDate={setStartDate}
                />
              </div>
            </div>
            
            {/* All Day Switch */}
            <div className="flex items-center space-x-2">
              <Switch 
                id="all-day"
                checked={isAllDay}
                onCheckedChange={setIsAllDay}
              />
              <Label htmlFor="all-day">All day event</Label>
            </div>
            
            {/* Time selection (if not all day) */}
            {!isAllDay && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time *</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time *</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => handleLocationChange(e.target.value, 'manual')}
                placeholder="Enter location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-title">Location Title (Optional)</Label>
              <Input
                id="location-title"
                value={locationTitle}
                onChange={(e) => setLocationTitle(e.target.value)}
                placeholder="e.g., Conference Room A"
              />
            </div>
          </div>
        );
      
      case 'customize':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Customize your event (Coming soon)</h3>
            <p className="text-muted-foreground">
              This section will allow you to customize the appearance of your event invitation.
            </p>
          </div>
        );
      
      case 'share':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Shareable Event</h3>
            <p className="text-muted-foreground">
              After creating your event, you'll be able to share it with others.
            </p>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Calendar Integration</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Add this event to your calendar:
              </p>
              
              {/* Preview of calendar integration buttons */}
              {startDate && endDate && (
                <CalendarIntegrationButtons
                  event={{
                    id: 'preview',
                    title,
                    description,
                    location,
                    location_title: locationTitle,
                    start_time: startDate.toISOString(),
                    end_time: endDate.toISOString(),
                    is_all_day: isAllDay,
                    user_id: 'current-user',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    status: 'published',
                    customization: customization as any
                  }}
                />
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <div className="flex border-b">
            <button
              type="button"
              className={`px-4 py-2 font-medium ${
                activeTab === "details"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
            <button
              type="button"
              className={`px-4 py-2 font-medium ${
                activeTab === "customize"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("customize")}
            >
              Customize
            </button>
            <button
              type="button"
              className={`px-4 py-2 font-medium ${
                activeTab === "share"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("share")}
            >
              Share
            </button>
          </div>
          
          <div className="py-6">{renderActiveTab()}</div>
        </div>
        
        <div className="flex justify-between pt-4 border-t">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} type="button">
              Cancel
            </Button>
          )}
          
          <div className="flex space-x-2">
            {activeTab !== "details" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab(activeTab === "customize" ? "details" : "customize")}
              >
                Previous
              </Button>
            )}
            
            {activeTab !== "share" ? (
              <Button
                type="button"
                onClick={() => setActiveTab(activeTab === "details" ? "customize" : "share")}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Event"}
                <Calendar className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventCreationForm;
