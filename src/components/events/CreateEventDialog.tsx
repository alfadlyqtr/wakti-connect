
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EventFormTab } from '@/types/form.types';
import { EventDetailsForm } from './event-forms/EventDetailsForm';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { useEvents } from '@/hooks/useEvents';
import { Separator } from '@/components/ui/separator';
import { EventStatus, BackgroundType } from '@/types/event.types';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editEvent?: any;
}

export const CreateEventDialog: React.FC<CreateEventDialogProps> = ({
  open,
  onOpenChange,
  editEvent
}) => {
  const [activeTab, setActiveTab] = useState<EventFormTab>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventData, setEventData] = useState<any>({});
  const { createEvent } = useEvents();
  
  const handleTabChange = (tab: EventFormTab) => {
    setActiveTab(tab);
  };
  
  const handleNext = () => {
    if (activeTab === 'details') {
      setActiveTab('share');
    }
  };
  
  const handlePrev = () => {
    if (activeTab === 'share') {
      setActiveTab('details');
    }
  };
  
  const handleDetailsSubmit = (data: any) => {
    setEventData((prev: any) => ({
      ...prev,
      ...data
    }));
    handleNext();
  };
  
  const handleCreateEvent = async () => {
    try {
      setIsSubmitting(true);
      
      // Create a simplified event object for creation with proper type casting
      const eventToCreate = {
        title: eventData.title || "Untitled Event",
        description: eventData.description,
        location: eventData.location,
        startDate: eventData.date,
        isAllDay: eventData.isAllDay,
        status: 'draft' as EventStatus,
        // Add default customization with correct type annotations
        customization: {
          background: {
            type: 'solid' as BackgroundType,
            value: '#ffffff'
          },
          font: {
            family: 'Inter, sans-serif',
            size: '16px',
            color: '#000000'
          },
          buttons: {
            accept: {
              background: '#3b82f6',
              color: '#ffffff',
              shape: 'rounded',
              text: 'Accept'
            },
            decline: {
              background: '#ef4444',
              color: '#ffffff',
              shape: 'rounded',
              text: 'Decline',
              isVisible: true
            }
          },
          showAcceptDeclineButtons: true,
          showAddToCalendarButton: true
        }
      };
      
      const result = await createEvent.mutateAsync(eventToCreate);
      
      toast.success("Event created successfully!");
      onOpenChange(false);
      
      // Optionally navigate to the event detail page
      // navigate(`/events/${result.id}`);
      
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>{editEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} className="flex flex-col h-full">
          <div className="px-6">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger 
                value="details" 
                onClick={() => handleTabChange('details')}
              >
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="share" 
                onClick={() => handleTabChange('share')}
              >
                Share
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="overflow-y-auto max-h-[60vh]">
            <TabsContent value="details" className="mt-0 px-6">
              <EventDetailsForm
                onSubmit={handleDetailsSubmit} 
                initialData={eventData}
              />
            </TabsContent>
            
            <TabsContent value="share" className="mt-0 px-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Share Event</h3>
                <p className="text-muted-foreground text-sm">
                  Your event sharing options will be available after the event is created.
                </p>
                
                <Separator className="my-6" />
                
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    className="mr-2"
                    disabled={isSubmitting}
                  >
                    Back to Details
                  </Button>
                  
                  <Button 
                    onClick={handleCreateEvent}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Event'
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
          
          <div className="p-6 border-t mt-4 flex justify-between">
            {activeTab !== 'details' ? (
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={isSubmitting}
              >
                Previous
              </Button>
            ) : (
              <div></div>
            )}
            
            {activeTab === 'details' ? (
              <Button
                onClick={handleNext}
                disabled={isSubmitting || !eventData.title}
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleCreateEvent}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Event'
                )}
              </Button>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
