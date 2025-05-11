
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { deleteSimpleInvitation, getSimpleInvitations } from '@/services/invitation/operations/invitation-management';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import EventCard from '@/components/events/EventCard';

interface Event {
  id: string;
  title: string;
  description: string;
  start_time: string;
  location: string;
}

const SimpleInvitationsList = ({ isEventsList = false }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    try {
      const invitations = await getSimpleInvitations(isEventsList);
      setEvents(invitations as any);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load events.',
        variant: 'destructive',
      });
    }
  };

  const handleEditEvent = (eventId: string) => {
    navigate(`/dashboard/events/edit/${eventId}`);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteSimpleInvitation(eventId);
      toast({
        title: 'Success',
        description: 'Event deleted successfully.',
      });
      refresh(); // Refresh the list after deletion
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete event.',
        variant: 'destructive',
      });
    }
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/dashboard/events/view/${eventId}`);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Select first event for preview if available
  useEffect(() => {
    if (filteredEvents.length > 0 && !selectedEvent) {
      setSelectedEvent(filteredEvents[0]);
    }
  }, [filteredEvents, selectedEvent]);

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>{isEventsList ? 'Events' : 'Invitations'}</CardTitle>
          <CardDescription>Manage your {isEventsList ? 'events' : 'invitations'} here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-between items-center">
            <Input
              type="text"
              placeholder={`Search ${isEventsList ? 'events' : 'invitations'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button asChild>
              <Link to={`/dashboard/${isEventsList ? 'events' : 'invitations'}/create`}>
                <Plus className="mr-2 h-4 w-4" />
                Create {isEventsList ? 'Event' : 'Invitation'}
              </Link>
            </Button>
          </div>
          <Table>
            <TableCaption>A list of your {isEventsList ? 'events' : 'invitations'}.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEditEvent(event.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleViewEvent(event.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedEvent && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Event Card Preview</h2>
          <EventCard 
            title={selectedEvent.title}
            description={selectedEvent.description}
            date={new Date(selectedEvent.start_time)}
            location={selectedEvent.location || "No location"}
            onClick={() => handleViewEvent(selectedEvent.id)}
          />
        </div>
      )}
    </div>
  );
};

export default SimpleInvitationsList;
