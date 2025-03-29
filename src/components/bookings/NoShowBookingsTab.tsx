
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { CheckCircle, XCircle, Clock, Calendar, User, UserX } from "lucide-react";
import { BookingWithRelations } from "@/types/booking.types";

interface NoShowBookingsTabProps {
  noShowBookings: BookingWithRelations[];
  onApproveNoShow: (bookingId: string) => void;
  onRejectNoShow: (bookingId: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

const NoShowBookingsTab: React.FC<NoShowBookingsTabProps> = ({
  noShowBookings,
  onApproveNoShow,
  onRejectNoShow,
  isApproving,
  isRejecting
}) => {
  // Separate pending and approved no-shows
  const pendingNoShows = noShowBookings.filter(booking => 
    booking.is_no_show && booking.no_show_pending_approval
  );
  const approvedNoShows = noShowBookings.filter(booking => 
    booking.status === 'no_show'
  );

  if (noShowBookings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No no-show bookings found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending No-Shows Section */}
      {pendingNoShows.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <UserX className="h-5 w-5 text-amber-500" />
            Pending Approval ({pendingNoShows.length})
          </h3>
          
          {pendingNoShows.map(booking => (
            <Card key={booking.id} className="border-amber-300">
              <CardHeader className="bg-amber-50 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{booking.title}</CardTitle>
                  <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
                    Pending Approval
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
                    {booking.no_show_at && (
                      <div className="flex items-center mb-2">
                        <UserX className="h-4 w-4 mr-2 text-destructive" />
                        <span className="text-sm">
                          Marked no-show at {format(parseISO(booking.no_show_at), 'p')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Provider:</span>{' '}
                        {booking.staff?.name || booking.staff_name || 'Not assigned'}
                      </p>
                      {booking.service && (
                        <p className="text-sm">
                          <span className="font-medium">Service:</span>{' '}
                          {booking.service.name}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button
                        size="sm"
                        className="flex items-center"
                        onClick={() => onApproveNoShow(booking.id)}
                        disabled={isApproving}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center"
                        onClick={() => onRejectNoShow(booking.id)}
                        disabled={isRejecting}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Approved No-Shows Section */}
      {approvedNoShows.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <UserX className="h-5 w-5 text-destructive" />
            Confirmed No-Shows ({approvedNoShows.length})
          </h3>
          
          {approvedNoShows.map(booking => (
            <Card key={booking.id} className="border-red-200">
              <CardHeader className="bg-red-50 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{booking.title}</CardTitle>
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                    No-Show
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4">
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
                    {booking.no_show_at && (
                      <div className="flex items-center mb-2">
                        <UserX className="h-4 w-4 mr-2 text-destructive" />
                        <span className="text-sm">
                          Marked no-show at {format(parseISO(booking.no_show_at), 'p')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm mb-2">
                      <span className="font-medium">Provider:</span>{' '}
                      {booking.staff?.name || booking.staff_name || 'Not assigned'}
                    </p>
                    {booking.service && (
                      <p className="text-sm">
                        <span className="font-medium">Service:</span>{' '}
                        {booking.service.name}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoShowBookingsTab;
