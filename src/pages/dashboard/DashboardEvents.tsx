
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Plus, Send, Edit, Clock, Grid3X3, List, Users } from "lucide-react";
import { EventTab, Event } from "@/types/event.types";
import { useEvents } from "@/hooks/useEvents";
import EventCreationForm from "@/components/events/EventCreationForm";
import EventCard from "@/components/events/EventCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardEvents: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<EventTab>("my-events");
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showResponsesDialog, setShowResponsesDialog] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  const {
    events,
    filteredEvents,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterDate,
    setFilterDate,
    respondToInvitation,
    deleteEvent,
    refetch
  } = useEvents(activeTab);

  const handleTabChange = (tab: EventTab) => {
    setActiveTab(tab);
    setEditingEvent(null);
  };
  
  const handleCardClick = (event: Event) => {
    if (event.status === 'draft') {
      setEditingEvent(event);
      setShowCreateForm(true);
    }
    // For non-draft events, you could show a detailed view here
  };
  
  const handleAcceptInvitation = (eventId: string) => {
    respondToInvitation(eventId, 'accepted');
    toast({
      title: "Invitation Accepted",
      description: "You have accepted the invitation."
    });
  };
  
  const handleDeclineInvitation = (eventId: string) => {
    respondToInvitation(eventId, 'declined');
    toast({
      title: "Invitation Declined",
      description: "You have declined the invitation."
    });
  };
  
  const handleCreateOrEditEvent = () => {
    setEditingEvent(null);
    setShowCreateForm(true);
  };
  
  const handleCancelEdit = () => {
    setEditingEvent(null);
    setShowCreateForm(false);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
        toast({
          title: "Event Deleted",
          description: "The event has been successfully deleted."
        });
        refetch();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete the event. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowCreateForm(true);
  };

  const handleViewResponses = (eventId: string) => {
    setSelectedEventId(eventId);
    setShowResponsesDialog(true);
  };
  
  const handleFormSuccess = () => {
    // This function will be called when the form submits successfully
    setShowCreateForm(false);
    setEditingEvent(null);
    refetch(); // Refresh events list
  };

  // Helper to filter events based on tab
  const getFilteredTabEvents = () => {
    return filteredEvents.filter(event => {
      if (activeTab === "my-events") {
        return event.status !== "draft";
      }
      return true;
    });
  };

  // Get responses for the selected event
  const getEventResponses = () => {
    if (!selectedEventId) return { accepted: [], declined: [], pending: [] };
    
    const event = events.find(e => e.id === selectedEventId);
    if (!event?.invitations) return { accepted: [], declined: [], pending: [] };
    
    return {
      accepted: event.invitations.filter(inv => inv.status === 'accepted'),
      declined: event.invitations.filter(inv => inv.status === 'declined'),
      pending: event.invitations.filter(inv => inv.status === 'pending')
    };
  };

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg sm:text-xl font-bold truncate">Events</h1>
          {!showCreateForm && (
            <Button onClick={handleCreateOrEditEvent} size={isMobile ? "sm" : "default"} className="text-xs sm:text-sm">
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> {isMobile ? "Create" : "Create Event"}
            </Button>
          )}
        </div>

        {showCreateForm ? (
          <div className="mb-4">
            <EventCreationForm 
              editEvent={editingEvent}
              onCancel={handleCancelEdit}
              onSuccess={handleFormSuccess}
            />
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as EventTab)}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
                {/* Responsive TabsList */}
                <TabsList className="flex w-full sm:w-auto px-0.5 py-0.5">
                  <TabsTrigger 
                    value="my-events" 
                    className="flex-1 sm:flex-initial px-1.5 sm:px-3 py-1 sm:py-1.5 text-xs flex items-center"
                  >
                    <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" /> 
                    <span className="truncate">My Events</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="invited-events" 
                    className="flex-1 sm:flex-initial px-1.5 sm:px-3 py-1 sm:py-1.5 text-xs flex items-center"
                  >
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" /> 
                    <span className="truncate">Invites</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="draft-events" 
                    className="flex-1 sm:flex-initial px-1.5 sm:px-3 py-1 sm:py-1.5 text-xs flex items-center"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" /> 
                    <span className="truncate">Drafts</span>
                  </TabsTrigger>
                </TabsList>
                
                {/* View type toggle buttons - moved to filter section on mobile */}
                <div className={`${isMobile ? "hidden" : "flex"} gap-2`}>
                  <Button 
                    variant={viewType === 'grid' ? "default" : "outline"} 
                    size="icon"
                    onClick={() => setViewType('grid')}
                    className="h-9 w-9"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewType === 'list' ? "default" : "outline"} 
                    size="icon"
                    onClick={() => setViewType('list')}
                    className="h-9 w-9"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Responsive Filter Section */}
              <div className="my-2 sm:my-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="flex-1">
                  <Label htmlFor="search" className="sr-only">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs sm:text-sm h-8 sm:h-9"
                  />
                </div>
                
                <div className="flex gap-2 mt-0 sm:mt-0">
                  {/* View type toggle on mobile only */}
                  {isMobile && (
                    <div className="flex gap-1 mr-1">
                      <Button 
                        variant={viewType === 'grid' ? "default" : "outline"} 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setViewType('grid')}
                      >
                        <Grid3X3 className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant={viewType === 'list' ? "default" : "outline"} 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setViewType('list')}
                      >
                        <List className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  <div className={isMobile ? "flex-1 min-w-[80px]" : "w-[150px]"}>
                    <Label htmlFor="status" className="sr-only">Status</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger id="status" className="h-8 sm:h-9 text-xs sm:text-sm">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-xs sm:text-sm">All</SelectItem>
                        <SelectItem value="draft" className="text-xs sm:text-sm">Draft</SelectItem>
                        <SelectItem value="sent" className="text-xs sm:text-sm">Sent</SelectItem>
                        <SelectItem value="accepted" className="text-xs sm:text-sm">Accepted</SelectItem>
                        <SelectItem value="declined" className="text-xs sm:text-sm">Declined</SelectItem>
                        <SelectItem value="recalled" className="text-xs sm:text-sm">Recalled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className={isMobile ? "flex-1 min-w-[80px]" : "w-[150px]"}>
                    <DatePicker
                      date={filterDate}
                      setDate={setFilterDate}
                    />
                  </div>
                </div>
              </div>

              <TabsContent value="my-events" className="mt-2">
                {isLoading ? (
                  <div className="text-center py-6 sm:py-10">Loading events...</div>
                ) : getFilteredTabEvents().length > 0 ? (
                  <div className={
                    viewType === 'grid' 
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4" 
                      : "space-y-3 sm:space-y-4"
                  }>
                    {getFilteredTabEvents().map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        viewType="sent"
                        onCardClick={() => handleCardClick(event)}
                        onDelete={handleDeleteEvent}
                        onEdit={handleEditEvent}
                        onViewResponses={handleViewResponses}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-10">
                    <p className="text-muted-foreground text-sm sm:text-base">No events found</p>
                    <Button 
                      variant="link" 
                      className="mt-2"
                      onClick={handleCreateOrEditEvent}
                    >
                      Create your first event
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="invited-events" className="mt-2">
                {isLoading ? (
                  <div className="text-center py-6 sm:py-10">Loading invitations...</div>
                ) : filteredEvents.length > 0 ? (
                  <div className={
                    viewType === 'grid' 
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4" 
                      : "space-y-3 sm:space-y-4"
                  }>
                    {filteredEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        viewType="received"
                        onAccept={handleAcceptInvitation}
                        onDecline={handleDeclineInvitation}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-10">
                    <p className="text-muted-foreground text-sm sm:text-base">No invitations found</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="draft-events" className="mt-2">
                {isLoading ? (
                  <div className="text-center py-6 sm:py-10">Loading drafts...</div>
                ) : filteredEvents.length > 0 ? (
                  <div className={
                    viewType === 'grid' 
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4" 
                      : "space-y-3 sm:space-y-4"
                  }>
                    {filteredEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        viewType="draft"
                        onCardClick={() => handleCardClick(event)}
                        onDelete={handleDeleteEvent}
                        onEdit={handleEditEvent}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-10">
                    <p className="text-muted-foreground text-sm sm:text-base">No draft events found</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Responses Dialog */}
      <Dialog open={showResponsesDialog} onOpenChange={setShowResponsesDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Event Responses</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <span className="text-green-500">✓</span> Accepted ({getEventResponses().accepted.length})
              </h3>
              <ul className="mt-2 space-y-1">
                {getEventResponses().accepted.map(inv => (
                  <li key={inv.id} className="text-sm">
                    {inv.email || 'User #' + inv.invited_user_id?.slice(0, 8)}
                  </li>
                ))}
                {getEventResponses().accepted.length === 0 && (
                  <li className="text-sm text-muted-foreground">No acceptances yet</li>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <span className="text-red-500">✗</span> Declined ({getEventResponses().declined.length})
              </h3>
              <ul className="mt-2 space-y-1">
                {getEventResponses().declined.map(inv => (
                  <li key={inv.id} className="text-sm">
                    {inv.email || 'User #' + inv.invited_user_id?.slice(0, 8)}
                  </li>
                ))}
                {getEventResponses().declined.length === 0 && (
                  <li className="text-sm text-muted-foreground">No declines</li>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <span className="text-yellow-500">⏱</span> Pending ({getEventResponses().pending.length})
              </h3>
              <ul className="mt-2 space-y-1">
                {getEventResponses().pending.map(inv => (
                  <li key={inv.id} className="text-sm">
                    {inv.email || 'User #' + inv.invited_user_id?.slice(0, 8)}
                  </li>
                ))}
                {getEventResponses().pending.length === 0 && (
                  <li className="text-sm text-muted-foreground">No pending responses</li>
                )}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
};

export default DashboardEvents;
