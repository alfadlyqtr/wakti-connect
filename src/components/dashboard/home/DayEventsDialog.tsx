
import React from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Calendar as CalendarIcon, 
  Building 
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { CalendarEvent } from "@/types/calendar.types";

interface DayEventsDialogProps {
  date: Date | null;
  events: CalendarEvent[];
  isOpen: boolean;
  onClose: () => void;
  groupedEvents: {
    tasks: CalendarEvent[];
    appointments: CalendarEvent[];
    bookings: CalendarEvent[];
  };
}

const DayEventsDialog: React.FC<DayEventsDialogProps> = ({
  date,
  events,
  isOpen,
  onClose,
  groupedEvents
}) => {
  // Extract grouped events
  const { tasks, appointments, bookings } = groupedEvents;
  
  if (!date) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            Events for {format(date, "MMMM d, yyyy")}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {events.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No events scheduled for this day.
            </p>
          ) : (
            <>
              {/* Tasks Section */}
              {tasks.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm flex items-center mb-2">
                    <CheckCircle className="h-4 w-4 mr-2 text-amber-500" />
                    Tasks
                  </h3>
                  <ul className="space-y-2">
                    {tasks.map(task => (
                      <li key={task.id} className="border rounded-md p-2 text-sm">
                        {task.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Appointments Section */}
              {appointments.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm flex items-center mb-2">
                    <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
                    Appointments
                  </h3>
                  <ul className="space-y-2">
                    {appointments.map(appointment => (
                      <li key={appointment.id} className="border rounded-md p-2 text-sm">
                        {appointment.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Bookings Section */}
              {bookings.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm flex items-center mb-2">
                    <Building className="h-4 w-4 mr-2 text-green-500" />
                    Bookings
                  </h3>
                  <ul className="space-y-2">
                    {bookings.map(booking => (
                      <li key={booking.id} className="border rounded-md p-2 text-sm">
                        {booking.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="flex justify-between mt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          
          {events.length > 0 && (
            <div className="space-x-2">
              {tasks.length > 0 && (
                <NavLink to="/dashboard/tasks">
                  <Button variant="outline" size="sm">View Tasks</Button>
                </NavLink>
              )}
              {(appointments.length > 0 || bookings.length > 0) && (
                <NavLink to="/dashboard/appointments">
                  <Button variant="outline" size="sm">View Calendar</Button>
                </NavLink>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DayEventsDialog;
