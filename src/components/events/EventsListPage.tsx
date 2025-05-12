
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Calendar, Search, PlusCircle, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { getEvents } from '@/services/event/getEvents';
import { Event, EventTab } from '@/types/event.types';

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const navigate = useNavigate();
  
  const handleViewEvent = () => {
    navigate(`/dashboard/events/view/${event.id}`);
  };
  
  const formattedDate = event.start_time ? format(parseISO(event.start_time), 'MMM d, yyyy') : 'No date';
  const formattedTime = event.start_time && !event.is_all_day 
    ? format(parseISO(event.start_time), 'h:mm a')
    : (event.is_all_day ? 'All day' : 'No time');

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleViewEvent}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{event.title}</h3>
            {event.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">{event.description}</p>
            )}
          </div>
          <div className="text-sm text-muted-foreground">{formattedDate}</div>
        </div>
        
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {formattedTime}
            </span>
            {event.location && (
              <span className="text-xs text-muted-foreground">
                {event.location}
              </span>
            )}
          </div>
          
          <Button variant="ghost" size="sm" onClick={(e) => {
            e.stopPropagation();
            navigate(`/dashboard/events/edit/${event.id}`);
          }}>
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const EventsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<EventTab>('my-events');
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['events', activeTab],
    queryFn: () => getEvents(activeTab),
  });
  
  const handleCreateEvent = () => {
    navigate('/dashboard/events/create');
  };
  
  // Filter events based on search query
  const filteredEvents = React.useMemo(() => {
    if (!data?.events) return [];
    
    if (!searchQuery.trim()) return data.events;
    
    const query = searchQuery.toLowerCase();
    return data.events.filter(event => 
      event.title.toLowerCase().includes(query) ||
      (event.description && event.description.toLowerCase().includes(query)) ||
      (event.location && event.location.toLowerCase().includes(query))
    );
  }, [data?.events, searchQuery]);
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-muted-foreground">Manage your events</p>
        </div>
        
        <Button onClick={handleCreateEvent} className="mt-2 sm:mt-0">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="my-events" value={activeTab} onValueChange={(value) => setActiveTab(value as EventTab)}>
        <TabsList className="mb-4">
          <TabsTrigger value="my-events">My Events</TabsTrigger>
          <TabsTrigger value="invited-events">Invitations</TabsTrigger>
          <TabsTrigger value="draft-events">Drafts</TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center p-8 text-destructive">
            Error loading events. Please try again.
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center p-8 flex flex-col items-center justify-center">
            <Calendar className="h-12 w-12 mb-2 text-muted-foreground" />
            <p className="mb-2">No events found</p>
            <Button variant="outline" onClick={handleCreateEvent}>
              Create your first event
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default EventsListPage;
