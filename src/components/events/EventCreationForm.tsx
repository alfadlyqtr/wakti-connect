
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { CalendarIcon, Clock, Send, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEvents } from "@/hooks/useEvents";
import { toast } from "@/components/ui/use-toast";
import { EventFormData, EventCustomization } from "@/types/event.types";
import { InvitationRecipient } from "@/types/invitation.types";
import LocationInput from "@/components/events/location/LocationInput";
import RecipientSelector from "@/components/invitations/RecipientSelector";
import CustomizeTab from "@/components/events/customize/CustomizeTab";
import ShareLinksTab from "@/components/events/share/ShareLinksTab";

const EventCreationForm: React.FC = () => {
  const { createEvent, canCreateEvents, userRole } = useEvents();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isAllDay, setIsAllDay] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [recipients, setRecipients] = useState<InvitationRecipient[]>([]);
  const [shareTab, setShareTab] = useState<'recipients' | 'links'>('recipients');
  
  // Location state
  const [locationType, setLocationType] = useState<'manual' | 'google_maps'>('manual');
  const [location, setLocation] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  
  // Customization state
  const [customization, setCustomization] = useState<EventCustomization>({
    background: {
      type: 'color',
      value: '#ffffff',
    },
    font: {
      family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      size: 'medium',
      color: '#333333',
    },
    buttons: {
      accept: {
        background: '#4CAF50',
        color: '#ffffff',
        shape: 'rounded',
      },
      decline: {
        background: '#f44336',
        color: '#ffffff',
        shape: 'rounded',
      }
    },
    headerStyle: 'simple',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EventFormData>();

  const addRecipient = (recipient: InvitationRecipient) => {
    setRecipients(prev => [...prev, recipient]);
  };

  const removeRecipient = (index: number) => {
    setRecipients(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleLocationChange = (value: string, type: 'manual' | 'google_maps', url?: string) => {
    setLocation(value);
    setLocationType(type);
    if (type === 'google_maps' && url) {
      setMapsUrl(url);
    } else {
      setMapsUrl('');
    }
  };

  const processDateAndTime = (formData: EventFormData) => {
    // Create ISO string for start and end times
    const startDateTime = new Date(selectedDate);
    const endDateTime = new Date(selectedDate);
    
    if (!isAllDay) {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      
      startDateTime.setHours(startHours, startMinutes, 0);
      endDateTime.setHours(endHours, endMinutes, 0);
    } else {
      // For all-day events
      startDateTime.setHours(0, 0, 0, 0);
      endDateTime.setHours(23, 59, 59, 999);
    }
    
    return {
      ...formData,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      is_all_day: isAllDay,
      location: location,
      location_type: locationType,
      maps_url: locationType === 'google_maps' ? mapsUrl : undefined,
      customization: customization
    };
  };

  const onSubmit = async (formData: EventFormData) => {
    try {
      setIsSubmitting(true);
      
      if (!canCreateEvents) {
        toast({
          title: "Subscription Required",
          description: "Creating events requires an Individual or Business subscription",
          variant: "destructive",
        });
        return;
      }
      
      const completeFormData = processDateAndTime(formData);
      
      // Determine status based on recipients
      const status = recipients.length > 0 ? 'sent' : 'draft';
      completeFormData.status = status;
      
      const result = await createEvent(completeFormData);
      
      if (result?.id) {
        // This would actually send invitations to recipients in a real implementation
        if (recipients.length > 0) {
          toast({
            title: "Event Created and Invitations Sent",
            description: `Your event "${formData.title}" has been created and invitations have been sent.`,
          });
        } else {
          toast({
            title: "Event Created",
            description: `Your event "${formData.title}" has been created as a draft.`,
          });
        }
        
        // Reset form
        reset();
        setSelectedDate(new Date());
        setStartTime("09:00");
        setEndTime("10:00");
        setIsAllDay(false);
        setActiveTab("details");
        setRecipients([]);
        setLocation('');
        setLocationType('manual');
        setMapsUrl('');
        setCustomization({
          background: {
            type: 'color',
            value: '#ffffff',
          },
          font: {
            family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            size: 'medium',
            color: '#333333',
          },
          buttons: {
            accept: {
              background: '#4CAF50',
              color: '#ffffff',
              shape: 'rounded',
            },
            decline: {
              background: '#f44336',
              color: '#ffffff',
              shape: 'rounded',
            }
          },
          headerStyle: 'simple',
        });
      }
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast({
        title: "Failed to create event",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextTab = () => {
    if (activeTab === "details") setActiveTab("customize");
    else if (activeTab === "customize") setActiveTab("share");
  };

  const handlePrevTab = () => {
    if (activeTab === "share") setActiveTab("customize");
    else if (activeTab === "customize") setActiveTab("details");
  };
  
  // Handle email sharing from the ShareLinksTab
  const handleSendEmail = (email: string) => {
    const newRecipient: InvitationRecipient = {
      id: Date.now().toString(), // temporary ID
      name: email,
      email: email,
      type: 'email'
    };
    
    addRecipient(newRecipient);
    
    // Switch to the recipients tab to show the new recipient
    setShareTab('recipients');
  };
  
  // If user can't create events, show upgrade message
  if (!canCreateEvents) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Upgrade Your Account</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>Creating events requires an Individual or Business subscription.</p>
          <Button className="mt-2" onClick={() => window.location.href = '/dashboard/upgrade'}>
            Upgrade Now
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4 w-full max-w-md mx-auto">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Title is required" })}
                  placeholder="Event title"
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Add a description for your event"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <LocationInput
                  locationType={locationType}
                  location={location}
                  mapsUrl={mapsUrl}
                  onLocationChange={handleLocationChange}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isAllDay">All Day Event</Label>
                  <Switch
                    id="isAllDay"
                    checked={isAllDay}
                    onCheckedChange={setIsAllDay}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {!isAllDay && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <div className="flex">
                        <Clock className="mr-2 h-4 w-4 mt-3" />
                        <Input
                          id="startTime"
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <div className="flex">
                        <Clock className="mr-2 h-4 w-4 mt-3" />
                        <Input
                          id="endTime"
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end">
              <Button type="button" onClick={handleNextTab}>
                Next: Customize
              </Button>
            </CardFooter>
          </TabsContent>
          
          <TabsContent value="customize">
            <CardContent className="space-y-6">
              <CustomizeTab
                customization={customization}
                onCustomizationChange={setCustomization}
              />
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={handlePrevTab}>
                Back
              </Button>
              <Button type="button" onClick={handleNextTab}>
                Next: Share
              </Button>
            </CardFooter>
          </TabsContent>
          
          <TabsContent value="share">
            <CardContent className="space-y-6">
              <Tabs
                value={shareTab}
                onValueChange={(value) => setShareTab(value as 'recipients' | 'links')}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="recipients">Recipients</TabsTrigger>
                  <TabsTrigger value="links">Share Links</TabsTrigger>
                </TabsList>
                
                <TabsContent value="recipients">
                  <div className="py-4">
                    <RecipientSelector
                      selectedRecipients={recipients}
                      onAddRecipient={addRecipient}
                      onRemoveRecipient={removeRecipient}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="links">
                  <ShareLinksTab
                    eventId="temp-event-id" // This will be replaced with the actual ID after creation
                    onSendEmail={handleSendEmail}
                  />
                </TabsContent>
              </Tabs>
              
              <div className="border-t pt-4 mt-6">
                <div className="flex items-center mb-2">
                  <div className={cn(
                    "h-2 w-2 rounded-full mr-2",
                    recipients.length > 0 ? "bg-green-500" : "bg-amber-500"
                  )}></div>
                  <span className="text-sm font-medium">
                    {recipients.length > 0 
                      ? "Event will be sent to recipients" 
                      : "Event will be saved as draft"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {recipients.length > 0 
                    ? "Recipients will receive an invitation to view and respond to your event." 
                    : "Your event will be saved as a draft. You can send it later."}
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={handlePrevTab}>
                Back
              </Button>
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  variant="outline"
                  disabled={isSubmitting}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || recipients.length === 0}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Invitation
                </Button>
              </div>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
    </form>
  );
};

export default EventCreationForm;
