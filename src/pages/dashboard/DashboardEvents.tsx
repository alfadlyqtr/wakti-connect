
import React, { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { EventTab, Event } from "@/types/event.types";
import { useEvents } from "@/hooks/useEvents";
import EventCreationForm from "@/components/events/EventCreationForm";

// Import newly created components
import EventsHeader from "@/components/events/dashboard/EventsHeader";
import EventsFilter from "@/components/events/dashboard/EventsFilter";
import EventsList from "@/components/events/dashboard/EventsList";
import EventResponsesDialog from "@/components/events/dashboard/EventResponsesDialog";

const DashboardEvents: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<EventTab>("my-events");
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showResponsesDialog, setShowResponsesDialog] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
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

  // Helper to filter events based on tab
  const getFilteredTabEvents = () => {
    return filteredEvents.filter(event => {
      if (activeTab === "my-events") {
        return event.status !== "draft";
      }
      return true;
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <EventsHeader 
        showCreateForm={showCreateForm} 
        onCreateEvent={handleCreateOrEditEvent} 
      />

      {showCreateForm ? (
        <div className="mb-6">
          <EventCreationForm 
            editEvent={editingEvent}
            onCancel={handleCancelEdit}
          />
        </div>
      ) : (
        <>
          <Tabs value={activeTab}>
            <EventsFilter 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              viewType={viewType}
              setViewType={setViewType}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterDate={filterDate}
              setFilterDate={setFilterDate}
            />

            <TabsContent value="my-events" className="mt-2">
              <EventsList 
                events={getFilteredTabEvents()}
                viewType={viewType}
                activeTab={activeTab}
                isLoading={isLoading}
                onCardClick={handleCardClick}
                onDelete={handleDeleteEvent}
                onEdit={handleEditEvent}
                onViewResponses={handleViewResponses}
              />
            </TabsContent>

            <TabsContent value="invited-events" className="mt-2">
              <EventsList 
                events={filteredEvents}
                viewType={viewType}
                activeTab={activeTab}
                isLoading={isLoading}
                onAccept={handleAcceptInvitation}
                onDecline={handleDeclineInvitation}
              />
            </TabsContent>

            <TabsContent value="draft-events" className="mt-2">
              <EventsList 
                events={filteredEvents}
                viewType={viewType}
                activeTab={activeTab}
                isLoading={isLoading}
                onCardClick={handleCardClick}
                onDelete={handleDeleteEvent}
                onEdit={handleEditEvent}
              />
            </TabsContent>
          </Tabs>
        </>
      )}

      <EventResponsesDialog 
        open={showResponsesDialog}
        onOpenChange={setShowResponsesDialog}
        selectedEventId={selectedEventId}
        events={events}
      />
    </div>
  );
};

export default DashboardEvents;
