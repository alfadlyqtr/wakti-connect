
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
  UserX,
  Copy
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { BookingWithRelations, BookingStatus } from "@/types/booking.types";
import { formatCurrency } from "@/utils/formatUtils";
import { useStaffStatus } from "@/hooks/useStaffStatus";
import { useJobCards } from "@/hooks/useJobCards";
import { toast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface BookingsListProps {
  bookings: BookingWithRelations[];
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void;
  onAcknowledgeBooking?: (bookingId: string) => void;
  onMarkNoShow?: (bookingId: string) => void;
  onApproveNoShow?: (bookingId: string) => void;
  onRejectNoShow?: (bookingId: string) => void;
  isUpdating: boolean;
  isAcknowledging?: boolean;
  isMarkingNoShow?: boolean;
  isApproving?: boolean;
  isRejecting?: boolean;
  isNoShowTab?: boolean;
}

const BookingsList: React.FC<BookingsListProps> = ({ 
  bookings, 
  onUpdateStatus,
  onAcknowledgeBooking,
  onMarkNoShow,
  onApproveNoShow,
  onRejectNoShow,
  isUpdating,
  isAcknowledging = false,
  isMarkingNoShow = false,
  isApproving = false,
  isRejecting = false,
  isNoShowTab = false
}) => {
  const { isStaff, staffRelationId } = useStaffStatus();
  const { createJobCard } = useJobCards(staffRelationId);
  const [currentTime, setCurrentTime] = useState(new Date());
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleStartJob = async (booking: BookingWithRelations) => {
    if (!staffRelationId) {
      console.error("No staff relation ID found");
      return;
    }
    
    try {
      await createJobCard.mutateAsync({
        job_id: booking.service_id || "",
        start_time: new Date().toISOString(),
        payment_method: "none",
        payment_amount: booking.price || booking.service?.price || 0,
        notes: `Job created from booking: ${booking.title}`
      });
      
      onUpdateStatus(booking.id, "confirmed");
    } catch (error) {
      console.error("Error creating job card from booking:", error);
    }
  };

  const canMarkNoShow = (booking: BookingWithRelations) => {
    if (!booking) return false;
    
    const bookingStartTime = parseISO(booking.start_time);
    const minutesPast = differenceInMinutes(currentTime, bookingStartTime);
    
    return (
      booking.status !== 'cancelled' && 
      booking.status !== 'completed' &&
      booking.status !== 'no_show' &&
      !booking.is_no_show &&
      minutesPast >= 10
    );
  };

  const formatBookingId = (id: string) => {
    const shortId = id.substring(0, 8).toUpperCase();
    return `${shortId.substring(0, 4)}-${shortId.substring(4)}`;
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Copied to clipboard",
      description: "Booking reference has been copied to your clipboard.",
    });
  };

  // Helper to get badge styling based on booking status
  const getStatusBadgeStyle = (booking: BookingWithRelations) => {
    if (booking.status === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (booking.status === 'in_progress') return 'bg-blue-100 text-blue-800';
    if (booking.status === 'confirmed') return 'bg-green-100 text-green-800';
    if (booking.status === 'completed') return 'bg-green-500 text-white';
    if (booking.status === 'cancelled' || booking.status === 'no_show') return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
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

  // Format time based on device type
  const formatTime = (time: string) => {
    return format(parseISO(time), isMobile ? 'h:mm a' : 'p');
  };

  // Format date based on device type
  const formatDate = (date: string) => {
    return format(parseISO(date), isMobile ? 'MMM d' : 'PPP');
  };

  return (
    <div className="grid gap-3 sm:gap-4">
      {bookings.map((booking) => {
        const isTemplate = (booking as any).is_template;
        const isAcknowledged = booking.is_acknowledged === true;
        const isNoShow = booking.is_no_show === true || booking.status === 'no_show';
        const isPendingNoShowApproval = booking.is_no_show === true && booking.no_show_pending_approval === true;
        const showNoShowButton = canMarkNoShow(booking) && isStaff && !isNoShow && onMarkNoShow;
        
        return (
          <Card 
            key={booking.id} 
            className={`overflow-hidden ${isNoShow ? 'border-red-300' : isAcknowledged ? 'border-blue-300' : ''}`}
          >
            <CardHeader className="bg-muted pb-2 pt-3 px-3 sm:px-4 sm:pt-4 sm:pb-3">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-sm sm:text-lg flex items-center gap-1 sm:gap-2 line-clamp-1">
                  {isTemplate && <Bookmark className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />}
                  {isNoShow && <UserX className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />}
                  <span className="truncate">{booking.title}</span>
                </CardTitle>
                
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
                  {isAcknowledged && (
                    <span className="px-1.5 py-0.5 text-[10px] sm:text-xs rounded-full bg-blue-100 text-blue-800 whitespace-nowrap">
                      Staff Ack
                    </span>
                  )}
                  
                  {isPendingNoShowApproval && (
                    <span className="px-1.5 py-0.5 text-[10px] sm:text-xs rounded-full bg-amber-100 text-amber-800 whitespace-nowrap">
                      No-Show Pending
                    </span>
                  )}
                  
                  <span className={`px-1.5 py-0.5 text-[10px] sm:text-xs rounded-full whitespace-nowrap ${
                    isTemplate ? 'bg-purple-100 text-purple-800' :
                    getStatusBadgeStyle(booking)
                  }`}>
                    {isTemplate ? 'Template' : 
                      booking.status === 'no_show' ? 'No-Show' :
                      booking.status === 'in_progress' ? 'In Progress' :
                      booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2 pb-3 px-3 sm:px-4 sm:pt-3 sm:pb-4 text-xs sm:text-sm">
              {isTemplate ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    {booking.description && (
                      <p className="text-xs sm:text-sm mb-2 line-clamp-2">{booking.description}</p>
                    )}
                    <div className="flex items-center mb-1 sm:mb-2">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-muted-foreground flex-shrink-0" />
                      <span>{(booking as any).duration} minutes</span>
                    </div>
                    {(booking as any).price !== null && (
                      <div className="flex items-center mb-1 sm:mb-2">
                        <span className="font-medium">Price:</span>
                        <span className="ml-1 sm:ml-2">QAR {Number((booking as any).price).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    {booking.service && (
                      <div className="mb-1 sm:mb-2">
                        <span className="font-medium">Service:</span>
                        <span className="ml-1 sm:ml-2">{booking.service.name}</span>
                      </div>
                    )}
                    <div className="mb-1 sm:mb-2">
                      <span className="font-medium">Provider:</span>
                      <span className="ml-1 sm:ml-2 line-clamp-1">
                        {booking.staff?.name || booking.staff_name || 'Not assigned'}
                      </span>
                    </div>
                    <div className="flex space-x-2 mt-2 sm:mt-4">
                      <Link to="/dashboard/bookings?tab=templates">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex items-center h-7 sm:h-8 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5"
                        >
                          <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Manage
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3 bg-primary/5 p-1.5 sm:p-2 rounded-md">
                      <div className="flex items-center">
                        <span className="text-[10px] sm:text-xs font-medium mr-1 sm:mr-2">Ref:</span>
                        <code className="text-[10px] sm:text-xs font-mono">{formatBookingId(booking.id)}</code>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copyToClipboard(booking.id)}
                        className="h-5 w-5 sm:h-6 sm:w-6 p-0"
                      >
                        <span className="sr-only">Copy</span>
                        <Copy className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center mb-1 sm:mb-2">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-muted-foreground flex-shrink-0" />
                      <span>{formatDate(booking.start_time)}</span>
                    </div>
                    <div className="flex items-center mb-1 sm:mb-2">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-muted-foreground flex-shrink-0" />
                      <span>
                        {formatTime(booking.start_time)} - 
                        {formatTime(booking.end_time)}
                      </span>
                    </div>
                    <div className="flex items-center mb-1 sm:mb-2">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{booking.customer_name || 'No name provided'}</span>
                    </div>
                    {booking.customer_email && (
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{booking.customer_email}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    {booking.service && (
                      <div className="mb-1 sm:mb-2">
                        <span className="font-medium">Service:</span>
                        <span className="ml-1 sm:ml-2">{booking.service.name}</span>
                        {booking.service.price !== null && (
                          <div className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs">
                            Price: QAR {booking.service.price.toFixed(2)}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="mb-1 sm:mb-2">
                      <span className="font-medium">Provider:</span>
                      <span className="ml-1 sm:ml-2 truncate">
                        {booking.staff?.name || booking.staff_name || 'Not assigned'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-4">
                      {isStaff && !isAcknowledged && booking.status !== 'cancelled' && booking.status !== 'no_show' && booking.status !== 'completed' && onAcknowledgeBooking && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-7 sm:h-8 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5"
                          onClick={() => onAcknowledgeBooking(booking.id)}
                          disabled={isAcknowledging}
                        >
                          <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {isMobile ? "Ack" : "Acknowledge"}
                        </Button>
                      )}
                      
                      {showNoShowButton && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                className="h-7 sm:h-8 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5"
                                onClick={() => onMarkNoShow && onMarkNoShow(booking.id)}
                                disabled={isMarkingNoShow}
                              >
                                <UserX className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                {isMobile ? "No-Show" : "Mark No-Show"}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Mark customer as no-show (10+ min late)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      {isPendingNoShowApproval && !isStaff && isNoShowTab && onApproveNoShow && onRejectNoShow && (
                        <>
                          <Button 
                            size="sm" 
                            variant="default"
                            className="h-7 sm:h-8 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5"
                            onClick={() => onApproveNoShow(booking.id)}
                            disabled={isApproving}
                          >
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {isMobile ? "Approve" : "Approve No-Show"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-7 sm:h-8 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5"
                            onClick={() => onRejectNoShow(booking.id)}
                            disabled={isRejecting}
                          >
                            <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {isMobile ? "Reject" : "Reject No-Show"}
                          </Button>
                        </>
                      )}
                      
                      {isStaff && isAcknowledged && booking.status !== 'cancelled' && booking.status !== 'completed' && booking.status !== 'no_show' && !booking.is_no_show && (
                        <Button 
                          size="sm" 
                          className="h-7 sm:h-8 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5"
                          onClick={() => handleStartJob(booking)}
                          disabled={createJobCard.isPending}
                        >
                          <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {isMobile ? "Start" : "Start Job"}
                        </Button>
                      )}
                      
                      {booking.status === 'pending' && !isStaff && !booking.is_no_show && !isNoShowTab && (
                        <>
                          <Button 
                            size="sm" 
                            className="h-7 sm:h-8 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5"
                            onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                            disabled={isUpdating}
                          >
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {isMobile ? "Confirm" : "Confirm"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 sm:h-8 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5"
                            onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                            disabled={isUpdating}
                          >
                            <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {isMobile ? "Cancel" : "Cancel"}
                          </Button>
                        </>
                      )}
                      
                      {/* Only show Complete button to business owners for in_progress or confirmed bookings */}
                      {(booking.status === 'in_progress' || booking.status === 'confirmed') && !isStaff && !booking.is_no_show && !isNoShowTab && (
                        <>
                          <Button 
                            size="sm" 
                            className="h-7 sm:h-8 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5"
                            onClick={() => onUpdateStatus(booking.id, 'completed')}
                            disabled={isUpdating}
                          >
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {isMobile ? "Complete" : "Mark Completed"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 sm:h-8 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5"
                            onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                            disabled={isUpdating}
                          >
                            <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {isMobile ? "Cancel" : "Cancel"}
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
