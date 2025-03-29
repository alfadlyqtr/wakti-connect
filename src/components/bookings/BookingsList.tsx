
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format, parseISO, differenceInMinutes } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Trash, 
  Globe, 
  EyeOff, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Bookmark, 
  Settings, 
  CheckCircle, 
  XCircle,
  ThumbsUp,
  PlayCircle,
  UserX
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { BookingWithRelations, BookingStatus } from "@/types/booking.types";
import { formatCurrency } from "@/utils/formatUtils";
import { useMobileBreakpoint } from "@/hooks/useBreakpoint";
import { useStaffStatus } from "@/hooks/useStaffStatus";
import { useJobCards } from "@/hooks/useJobCards";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BookingsListProps {
  bookings: BookingWithRelations[];
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void;
  onAcknowledgeBooking?: (bookingId: string) => void;
  onMarkNoShow?: (bookingId: string) => void;
  isUpdating: boolean;
  isAcknowledging?: boolean;
  isMarkingNoShow?: boolean;
}

const BookingsList: React.FC<BookingsListProps> = ({ 
  bookings, 
  onUpdateStatus,
  onAcknowledgeBooking,
  onMarkNoShow,
  isUpdating,
  isAcknowledging = false,
  isMarkingNoShow = false
}) => {
  const { isStaff, staffRelationId } = useStaffStatus();
  const { createJobCard } = useJobCards(staffRelationId);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every minute to check for no-show eligibility
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Helper function to create a job card from a booking
  const handleStartJob = async (booking: BookingWithRelations) => {
    if (!staffRelationId) {
      console.error("No staff relation ID found");
      return;
    }
    
    try {
      // Create a job card using booking information
      await createJobCard.mutateAsync({
        job_id: booking.service_id || "",
        start_time: new Date().toISOString(),
        payment_method: "none", // Will be updated when job is completed
        payment_amount: booking.price || booking.service?.price || 0,
        notes: `Job created from booking: ${booking.title}`
      });
      
      // Optionally update booking status to reflect job has started
      onUpdateStatus(booking.id, "confirmed");
    } catch (error) {
      console.error("Error creating job card from booking:", error);
    }
  };

  // Helper function to check if a booking is eligible for no-show marking
  const canMarkNoShow = (booking: BookingWithRelations) => {
    if (!booking) return false;
    
    const bookingStartTime = parseISO(booking.start_time);
    const minutesPast = differenceInMinutes(currentTime, bookingStartTime);
    
    return (
      booking.status !== 'cancelled' && 
      booking.status !== 'completed' &&
      booking.status !== 'no_show' &&
      !booking.is_no_show &&
      minutesPast >= 10 // At least 10 minutes past the start time
    );
  };

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No bookings found.</p>
        </CardContent>
      </Card>
    );
  }

  console.log("Rendering BookingsList with bookings:", bookings);

  return (
    <div className="grid gap-4">
      {bookings.map((booking) => {
        // Check if this is a template booking
        const isTemplate = (booking as any).is_template;
        const isAcknowledged = booking.is_acknowledged === true;
        const isNoShow = booking.is_no_show === true || booking.status === 'no_show';
        const isPendingNoShowApproval = booking.is_no_show === true && booking.no_show_pending_approval === true;
        const showNoShowButton = canMarkNoShow(booking) && isStaff && !isNoShow && onMarkNoShow;
        
        return (
          <Card 
            key={booking.id} 
            className={`overflow-hidden ${isNoShow ? 'border-red-300' : ''}`}
          >
            <CardHeader className="bg-muted pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2">
                  {isTemplate && <Bookmark className="h-4 w-4 text-primary" />}
                  {isNoShow && <UserX className="h-4 w-4 text-destructive" />}
                  {booking.title}
                </CardTitle>
                
                <div className="flex items-center gap-2">
                  {isAcknowledged && isStaff && (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      Acknowledged
                    </span>
                  )}
                  
                  {isPendingNoShowApproval && (
                    <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
                      No-Show Pending
                    </span>
                  )}
                  
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    isTemplate ? 'bg-purple-100 text-purple-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    booking.status === 'no_show' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {isTemplate ? 'Pre-Booking Template' : 
                      booking.status === 'no_show' ? 'No-Show' :
                      booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {isTemplate ? (
                // Template display
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    {booking.description && (
                      <p className="text-sm mb-2">{booking.description}</p>
                    )}
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{(booking as any).duration} minutes</span>
                    </div>
                    {(booking as any).price !== null && (
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium">Price:</span>
                        <span className="text-sm ml-2">QAR {Number((booking as any).price).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    {booking.service && (
                      <div className="mb-2">
                        <span className="text-sm font-medium">Service:</span>
                        <span className="text-sm ml-2">{booking.service.name}</span>
                      </div>
                    )}
                    <div className="mb-2">
                      <span className="text-sm font-medium">Provider:</span>
                      <span className="text-sm ml-2">
                        {booking.staff?.name || booking.staff_name || 'Not assigned'}
                      </span>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Link to="/dashboard/bookings?tab=templates">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex items-center"
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Manage Template
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                // Regular booking display
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
                        {booking.staff?.name || booking.staff_name || 'Not assigned'}
                      </span>
                    </div>
                    
                    {/* Different actions depending on role and status */}
                    <div className="flex flex-wrap space-x-2 mt-4">
                      {/* Staff actions - Acknowledge booking */}
                      {isStaff && !isAcknowledged && booking.status !== 'cancelled' && booking.status !== 'no_show' && onAcknowledgeBooking && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex items-center mb-2"
                          onClick={() => onAcknowledgeBooking(booking.id)}
                          disabled={isAcknowledging}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                      
                      {/* Staff actions - Mark as No-Show */}
                      {showNoShowButton && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                className="flex items-center mb-2"
                                onClick={() => onMarkNoShow && onMarkNoShow(booking.id)}
                                disabled={isMarkingNoShow}
                              >
                                <UserX className="h-4 w-4 mr-1" />
                                Mark No-Show
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mark customer as no-show (10+ min late)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      {/* Staff actions - Start Job (only for acknowledged bookings) */}
                      {isStaff && isAcknowledged && booking.status !== 'cancelled' && booking.status !== 'completed' && booking.status !== 'no_show' && !booking.is_no_show && (
                        <Button 
                          size="sm" 
                          className="flex items-center mb-2"
                          onClick={() => handleStartJob(booking)}
                          disabled={createJobCard.isPending}
                        >
                          <PlayCircle className="h-4 w-4 mr-1" />
                          Start Job
                        </Button>
                      )}
                      
                      {/* Admin/Business actions for pending bookings */}
                      {booking.status === 'pending' && !isStaff && !booking.is_no_show && (
                        <>
                          <Button 
                            size="sm" 
                            className="flex items-center mb-2"
                            onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                            disabled={isUpdating}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Confirm
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex items-center mb-2"
                            onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                            disabled={isUpdating}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                      
                      {/* Admin/Business actions for confirmed bookings */}
                      {booking.status === 'confirmed' && !isStaff && !booking.is_no_show && (
                        <>
                          <Button 
                            size="sm" 
                            className="flex items-center mb-2"
                            onClick={() => onUpdateStatus(booking.id, 'completed')}
                            disabled={isUpdating}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Completed
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex items-center mb-2"
                            onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                            disabled={isUpdating}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BookingsList;
