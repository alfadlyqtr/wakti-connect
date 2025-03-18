
import React from "react";
import { Booking } from "@/types/booking.types";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatTime } from "@/utils/dateUtils";
import BookingStatusBadge from "./BookingStatusBadge";
import BookingActionMenu from "./BookingActionMenu";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingListViewProps {
  bookings: Booking[];
  isLoading: boolean;
  onRefresh: () => void;
}

const BookingListView: React.FC<BookingListViewProps> = ({ 
  bookings, 
  isLoading,
  onRefresh
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md mt-4">
        <h3 className="text-lg font-medium">No bookings found</h3>
        <p className="text-muted-foreground mb-4">No bookings matching your filters were found.</p>
        <Button variant="outline" onClick={onRefresh}>Refresh</Button>
      </div>
    );
  }
  
  return (
    <div className="mt-4 space-y-4">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} onRefresh={onRefresh} />
      ))}
    </div>
  );
};

interface BookingCardProps {
  booking: Booking;
  onRefresh: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onRefresh }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{booking.title}</h3>
              <BookingStatusBadge status={booking.status} />
            </div>
            
            <p className="text-sm text-muted-foreground">{booking.description}</p>
            
            <div className="flex items-center gap-6 mt-2">
              <div>
                <p className="text-xs text-muted-foreground">Customer</p>
                <p className="text-sm">{booking.customer_name || booking.customer_email || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Date & Time</p>
                <p className="text-sm">{formatDate(booking.start_time)} at {formatTime(booking.start_time)}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm">
                  {booking.end_time 
                    ? `${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}`
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>
          
          <BookingActionMenu booking={booking} onActionComplete={onRefresh} />
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingListView;
