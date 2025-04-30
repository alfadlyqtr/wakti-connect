
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useEvents } from "@/hooks/useEvents";
import { EventCreationForm } from "@/components/events";
import { Event as EventType, EventTab } from "@/types/event.types";
import { format } from "date-fns";

const DashboardEvents = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentTab, setCurrentTab] = useState<EventTab>('my-events');
  const [searchQuery, setSearchQuery] = useState('');
  const { filteredEvents, isLoading, setSearchQuery: setEventsSearchQuery, filterStatus, setFilterStatus, canCreateEvents } = useEvents(currentTab);
  
  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setEventsSearchQuery(query);
  };
  
  // Format date for display
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setCurrentTab(value as EventTab);
  };
  
  if (showCreateForm) {
    return (
      <div className="container mx-auto px-4">
        <EventCreationForm onCancel={() => setShowCreateForm(false)} onSuccess={() => setShowCreateForm(false)} />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        {canCreateEvents && (
          <Button onClick={() => setShowCreateForm(true)} className="mt-4 md:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Create New Event
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <CardTitle>Your Events</CardTitle>
            <div className="w-full md:w-64">
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={currentTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="my-events">My Events</TabsTrigger>
              <TabsTrigger value="invited-events">Invitations</TabsTrigger>
              <TabsTrigger value="draft-events">Drafts</TabsTrigger>
            </TabsList>
            
            <TabsContent value={currentTab}>
              {isLoading ? (
                <div className="text-center py-8">
                  <CalendarDays className="h-8 w-8 mx-auto mb-2 animate-pulse text-muted-foreground" />
                  <p>Loading events...</p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarDays className="h-8 w-8 mx-auto mb-2" />
                  <p>No events found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map((event: EventType) => (
                    <Card key={event.id} className="overflow-hidden">
                      <div className="p-4 flex flex-col md:flex-row justify-between">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatEventDate(event.start_time)}
                          </p>
                          {event.location && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Location: {event.location_title || event.location}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center mt-4 md:mt-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            event.status === 'sent' ? 'bg-green-100 text-green-800' :
                            event.status === 'draft' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {event.status === 'sent' ? 'Sent' : 
                             event.status === 'draft' ? 'Draft' : 
                             'Active'}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardEvents;
