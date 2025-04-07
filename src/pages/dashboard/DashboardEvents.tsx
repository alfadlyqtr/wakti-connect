
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
import { useTranslation } from 'react-i18next';

export default function DashboardEvents() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewResponsesEvent, setViewResponsesEvent] = useState<Event | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [currentTab, setCurrentTab] = useState<EventTab>('my-events');
  const { toast } = useToast();
  const { t } = useTranslation();
  
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
          <h1 className="text-2xl font-bold tracking-tight">{t('event.title')}</h1>
          <p className="text-muted-foreground">{t('event.subtitle')}</p>
        </div>
        
        <Button onClick={() => setOpenDialog(true)} disabled={!canCreateEvents}>
          <Plus className="mr-2 h-4 w-4" />
          {t('event.newEvent')}
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('event.searchEvents')}
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
                  {t('event.filter')}
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
                    <h4 className="font-medium">{t('event.filter')}</h4>
                    <div className="grid gap-2">
                      <div className="grid gap-1">
                        <Label htmlFor="status">{t('task.status.all')}</Label>
                        <select 
                          id="status"
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                        >
                          <option value="all">{t('task.status.all')}</option>
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="accepted">{t('event.accepted')}</option>
                          <option value="declined">{t('event.declined')}</option>
                        </select>
                      </div>
                      <div className="grid gap-1">
                        <Label htmlFor="date">{t('common.date')}</Label>
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
                              {filterDate ? format(filterDate, "PPP") : t('common.date')}
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
                    {t('common.remove')}
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
                  {t('event.gridView')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewType('list')}>
                  {t('event.listView')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="my-events" value={currentTab} onValueChange={(value) => setCurrentTab(value as EventTab)}>
        <TabsList className="mb-6">
          <TabsTrigger value="my-events">{t('event.tabs.myEvents')}</TabsTrigger>
          <TabsTrigger value="invited-events">{t('event.tabs.invitedEvents')}</TabsTrigger>
          <TabsTrigger value="draft-events">{t('event.tabs.draftEvents')}</TabsTrigger>
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
              title={t('event.noEvents')}
              description={
                canCreateEvents
                  ? t('event.noEventsDescription')
                  : t('event.upgradeToCreate')
              }
              icon={<CalendarIcon className="h-12 w-12 text-muted-foreground" />}
              action={
                canCreateEvents && (
                  <Button onClick={() => setOpenDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('event.newEvent')}
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
              title={t('event.noInvitations')}
              description={t('event.noInvitationsDescription')}
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
              title={t('event.noDraftEvents')}
              description={t('event.noDraftEventsDescription')}
              icon={<CalendarIcon className="h-12 w-12 text-muted-foreground" />}
              action={
                canCreateEvents && (
                  <Button onClick={() => setOpenDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('event.newEvent')}
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
              <DialogTitle>{t('event.editEvent')}</DialogTitle>
              <DialogDescription>
                {t('event.editEventDescription')}
              </DialogDescription>
            </DialogHeader>
          ) : viewResponsesEvent ? (
            <DialogHeader>
              <DialogTitle>{t('event.eventResponses')}</DialogTitle>
              <DialogDescription>
                {t('event.eventResponsesDescription')}
              </DialogDescription>
            </DialogHeader>
          ) : (
            <DialogHeader>
              <DialogTitle>{t('event.createNewEvent')}</DialogTitle>
              <DialogDescription>
                {t('event.createNewEventDescription')}
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
