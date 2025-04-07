
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  Filter, 
  Plus, 
  Search,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useEvents } from '@/hooks/useEvents';
import { Event, EventTab } from '@/types/event.types';
import { EventCard } from '@/components/events';
import { useToast } from '@/components/ui/use-toast';
import { EventCreationForm } from '@/components/events';
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/shared/EmptyState';
import { EventViewResponses } from '@/components/events';

export default function DashboardEvents() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewResponsesEvent, setViewResponsesEvent] = useState<Event | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [currentTab, setCurrentTab] = useState<EventTab>('my-events');
  const { toast } = useToast();
  
  // Get events with filtering functionality
  const { 
    filteredEvents, 
    isLoading, 
    searchQuery, 
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterDate,
    setFilterDate,
    canCreateEvents,
    userRole,
    deleteEvent,
    respondToInvitation,
    refetch
  } = useEvents(currentTab);
  
  // Clear filters handler
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterDate(undefined);
  };
  
  // Delete event handler
  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      toast({
        title: "Event deleted",
        description: "Your event has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Failed to delete event",
        description: "There was a problem deleting your event. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Edit event handler
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setOpenDialog(true);
  };
  
  // Dialog close handler
  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingEvent(null);
    setViewResponsesEvent(null);
  };
  
  // Dialog success handler
  const handleDialogSuccess = () => {
    // Refresh events
    refetch();
    setOpenDialog(false);
    setEditingEvent(null);
    setViewResponsesEvent(null);
  };
  
  // View responses handler
  const handleViewResponses = (eventId: string) => {
    const event = filteredEvents.find(e => e.id === eventId);
    if (event) {
      setViewResponsesEvent(event);
      setOpenDialog(true);
    }
  };
  
  // Accept invitation handler
  const handleAcceptInvitation = async (eventId: string) => {
    try {
      await respondToInvitation(eventId, 'accepted');
      toast({
        title: "Invitation accepted",
        description: "You have accepted the invitation."
      });
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast({
        title: "Failed to accept invitation",
        description: "There was a problem accepting the invitation. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Decline invitation handler
  const handleDeclineInvitation = async (eventId: string) => {
    try {
      await respondToInvitation(eventId, 'declined');
      toast({
        title: "Invitation declined",
        description: "You have declined the invitation."
      });
    } catch (error) {
      console.error('Error declining invitation:', error);
      toast({
        title: "Failed to decline invitation",
        description: "There was a problem declining the invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Manage your events and invitations</p>
        </div>
        
        <Button onClick={() => setOpenDialog(true)} disabled={!canCreateEvents}>
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto justify-start">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  {(filterStatus !== 'all' || filterDate) && (
                    <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal">
                      {filterStatus !== 'all' && filterDate ? '2' : '1'}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Filters</h4>
                    <div className="grid gap-2">
                      <div className="grid gap-1">
                        <Label htmlFor="status">Status</Label>
                        <select 
                          id="status"
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                        >
                          <option value="all">All status</option>
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="accepted">Accepted</option>
                          <option value="declined">Declined</option>
                        </select>
                      </div>
                      <div className="grid gap-1">
                        <Label htmlFor="date">Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="date"
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !filterDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {filterDate ? format(filterDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={filterDate}
                              onSelect={setFilterDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={handleClearFilters}
                    disabled={filterStatus === 'all' && !filterDate}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="w-10 h-10">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setViewType('grid')}>
                  Grid View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewType('list')}>
                  List View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="my-events" value={currentTab} onValueChange={(value) => setCurrentTab(value as EventTab)}>
        <TabsList className="mb-6">
          <TabsTrigger value="my-events">My Events</TabsTrigger>
          <TabsTrigger value="invited-events">Invitations</TabsTrigger>
          <TabsTrigger value="draft-events">Drafts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-events">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className={cn(
              viewType === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"
            )}>
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onCardClick={() => handleEditEvent(event)}
                  onDelete={handleDeleteEvent}
                  onEdit={handleEditEvent}
                  onViewResponses={handleViewResponses}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No events found"
              description={
                canCreateEvents
                  ? "Create your first event to get started!"
                  : "Upgrade to Individual or Business plan to create events."
              }
              icon={<CalendarIcon className="h-12 w-12 text-muted-foreground" />}
              action={
                canCreateEvents && (
                  <Button onClick={() => setOpenDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Event
                  </Button>
                )
              }
            />
          )}
        </TabsContent>
        
        <TabsContent value="invited-events">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className={cn(
              viewType === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"
            )}>
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onAccept={handleAcceptInvitation}
                  onDecline={handleDeclineInvitation}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No invitations"
              description="You don't have any pending invitations"
              icon={<CalendarIcon className="h-12 w-12 text-muted-foreground" />}
            />
          )}
        </TabsContent>
        
        <TabsContent value="draft-events">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className={cn(
              viewType === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"
            )}>
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onCardClick={() => handleEditEvent(event)}
                  onDelete={handleDeleteEvent}
                  onEdit={handleEditEvent}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No draft events"
              description="You don't have any draft events"
              icon={<CalendarIcon className="h-12 w-12 text-muted-foreground" />}
              action={
                canCreateEvents && (
                  <Button onClick={() => setOpenDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Event
                  </Button>
                )
              }
            />
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
          {editingEvent ? (
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>
                Make changes to your event details
              </DialogDescription>
            </DialogHeader>
          ) : viewResponsesEvent ? (
            <DialogHeader>
              <DialogTitle>Event Responses</DialogTitle>
              <DialogDescription>
                View who has responded to your event
              </DialogDescription>
            </DialogHeader>
          ) : (
            <DialogHeader>
              <DialogTitle>Create a New Event</DialogTitle>
              <DialogDescription>
                Fill in the details to create your event
              </DialogDescription>
            </DialogHeader>
          )}
          
          {viewResponsesEvent ? (
            <EventViewResponses 
              event={viewResponsesEvent} 
              onClose={handleDialogClose}
            />
          ) : (
            <EventCreationForm 
              editEvent={editingEvent}
              onCancel={handleDialogClose}
              onSuccess={handleDialogSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
