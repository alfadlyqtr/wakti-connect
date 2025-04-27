
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRole } from "@/types/user";
import { useEvents } from "@/hooks/useEvents";
import { format } from "date-fns";

interface DashboardEventsPreviewProps {
  userRole: UserRole;
}

const DashboardEventsPreview: React.FC<DashboardEventsPreviewProps> = ({ userRole }) => {
  const navigate = useNavigate();
  const { 
    events,
    filteredEvents, 
    isLoading
  } = useEvents();
  
  // Get only upcoming events (events with start_time in the future)
  const upcomingEvents = (filteredEvents || events || []).filter(event => {
    const eventDate = new Date(event.start_time);
    return eventDate > new Date();
  }).slice(0, 3); // Limit to 3 events

  return (
    <Card className="bg-gradient-to-br from-[#6366F1]/10 via-white/80 to-[#8B5CF6]/10 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-500" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[220px]">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 animate-pulse h-[72px]"></div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      {event.location && (
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {format(new Date(event.start_time), 'h:mm a')}
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                      {event.status}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(event.start_time), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming events
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 pt-3 pb-3">
        <Button 
          size="sm" 
          className="ml-auto"
          onClick={() => navigate('/dashboard/events')}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          {userRole === "business" || userRole === "super-admin" ? "Manage Events" : "View All Events"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DashboardEventsPreview;
