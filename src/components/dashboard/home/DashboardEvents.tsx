
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { fetchSimpleInvitations } from '@/services/invitation/simple-invitations';

const DashboardEvents = () => {
  const navigate = useNavigate();
  const { data: invitations, isLoading } = useQuery({
    queryKey: ['simple-invitations'],
    queryFn: () => fetchSimpleInvitations(),
  });

  const upcomingEvents = invitations?.filter(inv => {
    if (inv.date) {
      const eventDate = new Date(inv.date);
      return eventDate >= new Date();
    }
    return false;
  }).slice(0, 3) || [];

  const handleViewAllEvents = () => {
    navigate('/dashboard/events');
  };

  const handleCreateEvent = () => {
    navigate('/dashboard/events/create');  // Update path to match our new route
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center text-muted-foreground py-8">
            <span>Loading events...</span>
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{event.title}</p>
                  {event.date && (
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()} {event.time}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center text-muted-foreground py-8">
            <CalendarDays className="h-5 w-5 mr-2" />
            <span>No upcoming events</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={handleViewAllEvents}>
          View All
        </Button>
        <Button className="flex-1" onClick={handleCreateEvent}>
          Create Event
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DashboardEvents;
