
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useBookings } from '@/hooks/useBookings';
import { BookingWithRelations } from '@/types/booking.types';
import { parseISO, format, isToday, isTomorrow, isAfter } from 'date-fns';
import { CalendarClock, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const BookingsWidget = () => {
  const { bookings, isLoading, acknowledgeBooking } = useBookings();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <CalendarClock className="mr-2 h-5 w-5" />
            Upcoming Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            <span className="ml-2">Loading bookings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Filter bookings assigned to staff that are upcoming (not cancelled or completed)
  const upcomingBookings = bookings
    .filter(booking => 
      booking.staff_assigned_id && 
      booking.status !== 'cancelled' && 
      booking.status !== 'completed' &&
      isAfter(parseISO(booking.start_time), new Date())
    )
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 3);
  
  // Get unacknowledged bookings
  const unacknowledgedCount = bookings.filter(booking => 
    booking.staff_assigned_id && 
    booking.status !== 'cancelled' && 
    booking.is_acknowledged !== true
  ).length;
  
  const handleAcknowledge = async (booking: BookingWithRelations) => {
    try {
      await acknowledgeBooking.mutateAsync(booking.id);
    } catch (error) {
      console.error("Error acknowledging booking:", error);
    }
  };
  
  const getDateLabel = (date: string) => {
    const bookingDate = parseISO(date);
    if (isToday(bookingDate)) return "Today";
    if (isTomorrow(bookingDate)) return "Tomorrow";
    return format(bookingDate, "EEE, MMM d");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <CalendarClock className="mr-2 h-5 w-5" />
          Upcoming Bookings
          {unacknowledgedCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unacknowledgedCount} new
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingBookings.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No upcoming bookings found
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map(booking => (
              <div key={booking.id} className="border-b pb-3 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{booking.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {booking.customer_name || 'No customer name'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{getDateLabel(booking.start_time)}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(booking.start_time), 'h:mm a')}
                    </p>
                  </div>
                </div>
                {!booking.is_acknowledged && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                    onClick={() => handleAcknowledge(booking)}
                    disabled={acknowledgeBooking.isPending}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Acknowledge
                  </Button>
                )}
                {booking.is_acknowledged && (
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Acknowledged
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" asChild className="w-full">
          <Link to="/dashboard/bookings">
            View all bookings
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingsWidget;
