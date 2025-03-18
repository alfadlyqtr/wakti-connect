
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Plus, Send, Edit, Clock, Grid3X3, List } from "lucide-react";
import { EventTab, Event } from "@/types/event.types";
import { useEvents } from "@/hooks/useEvents";
import EventCreationForm from "@/components/events/EventCreationForm";
import EventCard from "@/components/events/EventCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const DashboardEvents: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<EventTab>("my-events");
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
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
    respondToInvitation
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

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Events</h1>
          {!showCreateForm && (
            <Button onClick={handleCreateOrEditEvent}>
              <Plus className="h-4 w-4 mr-2" /> Create Event
            </Button>
          )}
        </div>

        {showCreateForm ? (
          <div className="mb-6">
            <EventCreationForm 
              editEvent={editingEvent}
              onCancel={handleCancelEdit}
            />
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as EventTab)}>
              <div className="flex justify-between items-center">
                <TabsList className="grid grid-cols-3 w-[400px]">
                  <TabsTrigger value="my-events" className="flex items-center">
                    <Send className="h-4 w-4 mr-2" /> My Events
                  </TabsTrigger>
                  <TabsTrigger value="invited-events" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" /> Invitations
                  </TabsTrigger>
                  <TabsTrigger value="draft-events" className="flex items-center">
                    <Edit className="h-4 w-4 mr-2" /> Drafts
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2">
                  <Button 
                    variant={viewType === 'grid' ? "default" : "outline"} 
                    size="icon"
                    onClick={() => setViewType('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewType === 'list' ? "default" : "outline"} 
                    size="icon"
                    onClick={() => setViewType('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="my-4 flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Label htmlFor="search" className="sr-only">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="w-[150px]">
                  <Label htmlFor="status" className="sr-only">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                      <SelectItem value="recalled">Recalled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-[150px]">
                  <DatePicker
                    date={filterDate}
                    setDate={setFilterDate}
                  />
                </div>
              </div>

              <TabsContent value="my-events" className="mt-2">
                {isLoading ? (
                  <div className="text-center py-10">Loading events...</div>
                ) : filteredEvents.length > 0 ? (
                  <div className={
                    viewType === 'grid' 
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" 
                      : "space-y-4"
                  }>
                    {filteredEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        viewType="sent"
                        onCardClick={() => handleCardClick(event)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No events found</p>
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
                  <div className="text-center py-10">Loading invitations...</div>
                ) : filteredEvents.length > 0 ? (
                  <div className={
                    viewType === 'grid' 
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" 
                      : "space-y-4"
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
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No invitations found</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="draft-events" className="mt-2">
                {isLoading ? (
                  <div className="text-center py-10">Loading drafts...</div>
                ) : filteredEvents.length > 0 ? (
                  <div className={
                    viewType === 'grid' 
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" 
                      : "space-y-4"
                  }>
                    {filteredEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        viewType="draft"
                        onCardClick={() => handleCardClick(event)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No draft events found</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardShell>
  );
};

export default DashboardEvents;
