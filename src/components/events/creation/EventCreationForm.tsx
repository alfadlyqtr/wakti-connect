
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { eventSchema, EventFormValues } from '@/types/event.types';
import { createEvent } from '@/services/event/createService';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '../location/LocationPicker';
import CustomizeTab from '../customize/CustomizeTab';

const EventCreationForm: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Default values for customization
  const defaultCustomization = {
    background: {
      type: 'solid',
      value: '#ffffff'
    },
    font: {
      family: 'Inter, sans-serif',
      size: '16px',
      color: '#000000',
      weight: 'normal',
      alignment: 'left'
    },
    buttons: {
      accept: {
        background: '#4CAF50',
        color: '#ffffff',
        shape: 'rounded'
      },
      decline: {
        background: '#f44336',
        color: '#ffffff',
        shape: 'rounded'
      }
    }
  };
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: new Date(),
      isAllDay: false,
      location: '',
      location_title: ''
    }
  });
  
  // State for customization
  const [customization, setCustomization] = useState(defaultCustomization);
  
  const handleNextTab = () => {
    if (activeTab === 'details') {
      setActiveTab('customize');
    } else if (activeTab === 'customize') {
      setActiveTab('share');
    }
  };
  
  const handlePrevTab = () => {
    if (activeTab === 'customize') {
      setActiveTab('details');
    } else if (activeTab === 'share') {
      setActiveTab('customize');
    }
  };
  
  const onSubmit = async (formData: EventFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Create the event data
      const eventData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate || formData.startDate,
        isAllDay: formData.isAllDay || false,
        location: formData.location,
        location_title: formData.location_title,
        customization
      };
      
      const event = await createEvent(eventData);
      
      toast({
        title: "Event Created",
        description: "Your event has been created successfully",
      });
      
      // Navigate to the event view page
      navigate(`/events/${event.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      
      toast({
        title: "Failed to Create Event",
        description: "There was an error creating your event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="share">Share</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="details" className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Event title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Event description" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Date/Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <DatePicker date={field.value} setDate={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (Optional)</FormLabel>
                      <FormControl>
                        <DatePicker 
                          date={field.value} 
                          setDate={field.onChange}
                          placeholder="Select end date" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* All Day Toggle */}
              <FormField
                control={form.control}
                name="isAllDay"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">All Day Event</FormLabel>
                  </FormItem>
                )}
              />
              
              {/* Location */}
              <div className="space-y-2">
                <FormLabel>Location</FormLabel>
                <LocationPicker 
                  location={form.watch("location") || ""}
                  locationTitle={form.watch("location_title") || ""}
                  onLocationChange={(location, title) => {
                    form.setValue("location", location);
                    form.setValue("location_title", title);
                  }}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={handleNextTab}
                >
                  Next: Customize
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="customize">
              <CustomizeTab
                customization={customization}
                onCustomizationChange={setCustomization}
                handleNextTab={handleNextTab}
                handleSaveDraft={() => {
                  toast({
                    title: "Draft Saved",
                    description: "Your event draft has been saved",
                  });
                }}
                location={form.watch("location")}
                locationTitle={form.watch("location_title")}
                title={form.watch("title")}
                description={form.watch("description")}
                selectedDate={form.watch("startDate")}
              />
            </TabsContent>
            
            <TabsContent value="share" className="space-y-6">
              {/* Share content will be added here */}
              <p className="text-center text-muted-foreground">
                Finalize your event and share it with others.
              </p>
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePrevTab}
                >
                  Back
                </Button>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default EventCreationForm;
