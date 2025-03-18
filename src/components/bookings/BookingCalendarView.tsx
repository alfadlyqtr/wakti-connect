
import React, { useState } from "react";
import { Booking } from "@/types/booking.types";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
import { Loader2 } from "lucide-react";
import BookingStatusBadge from "./BookingStatusBadge";
import { formatTime } from "@/utils/dateUtils";

interface BookingCalendarViewProps {
  bookings: Booking[];
  isLoading: boolean;
}

const BookingCalendarView: React.FC<BookingCalendarViewProps> = ({ bookings, isLoading }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Get bookings for the selected date
  const bookingsForSelectedDate = bookings.filter(booking => 
    isSameDay(new Date(booking.start_time), selectedDate)
  );
  
  // Function to check if a date has bookings
  const dateHasBookings = (date: Date) => {
    return bookings.some(booking => isSameDay(new Date(booking.start_time), date));
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="grid md:grid-cols-5 gap-6 mt-4">
      <div className="md:col-span-2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="rounded-md border p-3"
          modifiers={{
            hasBookings: (date) => dateHasBookings(date),
          }}
          modifiersClassNames={{
            hasBookings: "bg-primary/20 font-bold",
          }}
        />
      </div>
      
      <div className="md:col-span-3">
        <h3 className="font-medium mb-4">
          {format(selectedDate, "MMMM d, yyyy")} - {bookingsForSelectedDate.length} Bookings
        </h3>
        
        {bookingsForSelectedDate.length === 0 ? (
          <div className="text-center py-8 border rounded-md">
            <p className="text-muted-foreground">No bookings for this date</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookingsForSelectedDate.map((booking) => (
              <BookingCalendarItem key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface BookingCalendarItemProps {
  booking: Booking;
}

const BookingCalendarItem: React.FC<BookingCalendarItemProps> = ({ booking }) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-2 bg-primary"></div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-base">{booking.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-1">{booking.description}</p>
            
            <div className="flex gap-4 mt-2">
              <div className="text-sm">
                <span className="block text-xs text-muted-foreground">Time</span>
                {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
              </div>
              
              <div className="text-sm">
                <span className="block text-xs text-muted-foreground">Customer</span>
                {booking.customer_name || booking.customer_email || "N/A"}
              </div>
            </div>
          </div>
          
          <BookingStatusBadge status={booking.status} />
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCalendarView;
