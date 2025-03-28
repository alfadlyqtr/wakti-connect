
import React from "react";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { BookingWithRelations } from "@/types/booking.types";

interface BookingDetailsCardProps {
  booking: BookingWithRelations;
}

const BookingDetailsCard: React.FC<BookingDetailsCardProps> = ({ booking }) => {
  const startTime = new Date(booking.start_time);
  const endTime = new Date(booking.end_time);
  
  // Get staff name from either the relation or the direct field
  const staffName = booking.staff?.name || booking.staff_name;

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex">
        <Calendar className="h-5 w-5 mr-3 text-primary" />
        <div>
          <p className="font-medium">Date</p>
          <p className="text-muted-foreground">{format(startTime, "EEEE, MMMM d, yyyy")}</p>
        </div>
      </div>
      
      <div className="flex">
        <Clock className="h-5 w-5 mr-3 text-primary" />
        <div>
          <p className="font-medium">Time</p>
          <p className="text-muted-foreground">
            {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
          </p>
        </div>
      </div>
      
      {staffName && (
        <div className="flex">
          <div className="h-5 w-5 mr-3 text-primary flex items-center justify-center">👤</div>
          <div>
            <p className="font-medium">Staff</p>
            <p className="text-muted-foreground">{staffName}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetailsCard;
