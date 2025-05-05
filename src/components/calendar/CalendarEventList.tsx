
import React from 'react';
import { CalendarEvent } from '@/types/calendar.types';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, Clock, MapPin, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { EventDot } from '@/components/dashboard/home/EventDot';
import { deleteManualEntry } from '@/services/calendar/manualEntryService';
import { toast } from '@/components/ui/use-toast';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface CalendarEventListProps {
  events: CalendarEvent[];
  userId: string | null;
  onEventUpdate: () => void;
}

const CalendarEventList: React.FC<CalendarEventListProps> = ({ events, userId, onEventUpdate }) => {
  const { isOpen, itemToDelete, confirmDelete, cancelDelete, openDialog } = 
    useConfirmDialog<string>();
    
  // Group events by type
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.type]) {
      acc[event.type] = [];
    }
    acc[event.type].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);
  
  // Define the order of event types
  const eventTypeOrder = ['event', 'task', 'booking', 'manual'];
  
  // Get event type label
  const getEventTypeLabel = (type: string): string => {
    switch (type) {
      case 'task': return 'Tasks';
      case 'booking': return 'Bookings';
      case 'event': return 'Events';
      case 'manual': return 'Manual Entries';
      default: return 'Other';
    }
  };
  
  const handleDeleteEntry = async () => {
    if (!itemToDelete || !userId) return;
    
    try {
      const success = await deleteManualEntry(itemToDelete);
      
      if (success) {
        toast({
          title: "Entry deleted",
          description: "Your calendar entry has been deleted successfully",
        });
        onEventUpdate();
      } else {
        throw new Error("Failed to delete entry");
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete calendar entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      cancelDelete();
    }
  };

  return (
    <div className="space-y-6">
      {eventTypeOrder
        .filter(type => groupedEvents[type]?.length > 0)
        .map(type => (
          <div key={type}>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <EventDot type={type as any} />
              <span className="ml-2">{getEventTypeLabel(type)}</span>
            </h4>
            <div className="space-y-2">
              {groupedEvents[type].map(event => (
                <Card key={event.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h5 className="font-medium">{event.title}</h5>
                        
                        {event.location && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        
                        {event.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                        )}
                        
                        <div className="flex items-center text-xs text-muted-foreground">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          <span>{format(new Date(event.date), "MMM d, yyyy")}</span>
                          {event.date instanceof Date && (
                            <>
                              <Clock className="h-3 w-3 mx-1" />
                              <span>{format(new Date(event.date), "h:mm a")}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Only allow deleting manual entries */}
                      {event.type === 'manual' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive/80 h-8 w-8 p-0"
                          onClick={() => openDialog(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
        
      <ConfirmationDialog
        title="Delete Entry"
        description="Are you sure you want to delete this calendar entry? This action cannot be undone."
        open={isOpen}
        onOpenChange={cancelDelete}
        onConfirm={handleDeleteEntry}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default CalendarEventList;
