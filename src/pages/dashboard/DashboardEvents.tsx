
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Plus, Send, Edit, Clock } from "lucide-react";
import { EventTab } from "@/types/event.types";
import { useEvents } from "@/hooks/useEvents";
import EventCreationForm from "@/components/events/EventCreationForm";
import EventCard from "@/components/events/EventCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DashboardEvents: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<EventTab>("my-events");
  
  const {
    events,
    filteredEvents,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterDate,
    setFilterDate
  } = useEvents(activeTab);

  const handleTabChange = (tab: EventTab) => {
    setActiveTab(tab);
  };

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Events</h1>
          {!showCreateForm && (
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create Event
            </Button>
          )}
        </div>

        {showCreateForm ? (
          <div className="mb-6">
            <EventCreationForm />
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as EventTab)}>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredEvents.map((event) => (
                      <EventCard key={event.id} event={event} viewType="sent" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No events found</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="invited-events" className="mt-2">
                {isLoading ? (
                  <div className="text-center py-10">Loading invitations...</div>
                ) : filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredEvents.map((event) => (
                      <EventCard key={event.id} event={event} viewType="received" />
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
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredEvents.map((event) => (
                      <EventCard key={event.id} event={event} viewType="sent" />
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
