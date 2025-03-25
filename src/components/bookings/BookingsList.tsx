
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, User, Mail, CheckCircle, XCircle } from "lucide-react";
import { BookingWithRelations, BookingStatus } from "@/types/booking.types";

interface BookingsListProps {
  bookings: BookingWithRelations[];
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void;
  isUpdating: boolean;
}

const BookingsList: React.FC<BookingsListProps> = ({ 
  bookings, 
  onUpdateStatus,
  isUpdating 
}) => {
  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No bookings found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {bookings.map((booking) => (
        <Card key={booking.id} className="overflow-hidden">
          <CardHeader className="bg-muted pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{booking.title}</CardTitle>
              <span className={`px-2 py-1 text-xs rounded-full ${
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    {format(parseISO(booking.start_time), 'PPP')}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    {format(parseISO(booking.start_time), 'p')} - 
                    {format(parseISO(booking.end_time), 'p')}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{booking.customer_name || 'No name provided'}</span>
                </div>
                {booking.customer_email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{booking.customer_email}</span>
                  </div>
                )}
              </div>
              
              <div>
                {booking.service && (
                  <div className="mb-2">
                    <span className="text-sm font-medium">Service:</span>
                    <span className="text-sm ml-2">{booking.service.name}</span>
                    {booking.service.price !== null && (
                      <div className="text-sm mt-1">
                        Price: QAR {booking.service.price.toFixed(2)}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mb-2">
                  <span className="text-sm font-medium">Provider:</span>
                  <span className="text-sm ml-2">
                    {booking.staff?.name || 'Not assigned'}
                  </span>
                </div>
                
                {booking.status === 'pending' && (
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      size="sm" 
                      className="flex items-center"
                      onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                      disabled={isUpdating}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Confirm
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex items-center"
                      onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                      disabled={isUpdating}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                )}
                {booking.status === 'confirmed' && (
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      size="sm" 
                      className="flex items-center"
                      onClick={() => onUpdateStatus(booking.id, 'completed')}
                      disabled={isUpdating}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Completed
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex items-center"
                      onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                      disabled={isUpdating}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookingsList;
