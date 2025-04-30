
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EventFormTab } from '@/types/form.types';
import { EventDetailsForm } from './event-forms/EventDetailsForm';
import { EventCustomizeForm } from './event-forms/EventCustomizeForm';
import { EventShareForm } from './event-forms/EventShareForm';
import { Loader2 } from 'lucide-react';

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
  
  const handleTabChange = (tab: EventFormTab) => {
    setActiveTab(tab);
  };
  
  const handleNext = () => {
    if (activeTab === 'details') {
      setActiveTab('customize');
    } else if (activeTab === 'customize') {
      setActiveTab('share');
    }
  };
  
  const handlePrev = () => {
    if (activeTab === 'customize') {
      setActiveTab('details');
    } else if (activeTab === 'share') {
      setActiveTab('customize');
    }
  };
  
  const handleDetailsSubmit = (data: any) => {
    setEventData((prev: any) => ({
      ...prev,
      ...data
    }));
    handleNext();
  };
  
  const handleCustomizationSubmit = (data: any) => {
    setEventData((prev: any) => ({
      ...prev,
      customization: data
    }));
    handleNext();
  };
  
  const handleShareSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Combine all data and create event
      const fullEventData = {
        ...eventData,
        invitations: data.invitations
      };
      
      console.log('Creating event with data:', fullEventData);
      // TODO: Implement event creation with Supabase
      
      // Close dialog on success
      setTimeout(() => {
        setIsSubmitting(false);
        onOpenChange(false);
      }, 1000);
    } catch (error) {
      console.error('Error creating event:', error);
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
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger 
                value="details" 
                onClick={() => handleTabChange('details')}
              >
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="customize" 
                onClick={() => handleTabChange('customize')}
              >
                Customize
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
            
            <TabsContent value="customize" className="mt-0 px-6">
              <EventCustomizeForm 
                onSubmit={handleCustomizationSubmit} 
                initialData={eventData?.customization}
                eventTitle={eventData?.title}
                eventDescription={eventData?.description}
              />
            </TabsContent>
            
            <TabsContent value="share" className="mt-0 px-6">
              <EventShareForm 
                onSubmit={handleShareSubmit}
                initialData={eventData}
              />
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
            
            {activeTab !== 'share' ? (
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={() => handleShareSubmit({})}
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
