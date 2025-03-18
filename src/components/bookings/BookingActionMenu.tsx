
import React from "react";
import { Booking } from "@/types/booking.types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Check, 
  X, 
  Calendar, 
  User, 
  Trash 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { updateBookingStatus } from "@/services/booking/updateService";
import { deleteBooking } from "@/services/booking/deleteService";

interface BookingActionMenuProps {
  booking: Booking;
  onActionComplete: () => void;
}

const BookingActionMenu: React.FC<BookingActionMenuProps> = ({ booking, onActionComplete }) => {
  const handleStatusChange = async (status: string) => {
    try {
      await updateBookingStatus(booking.id, status);
      toast({
        title: "Booking updated",
        description: `Booking has been marked as ${status}`,
      });
      onActionComplete();
    } catch (error: any) {
      toast({
        title: "Error updating booking",
        description: error.message || "There was a problem updating the booking",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBooking = async () => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    
    try {
      await deleteBooking(booking.id);
      toast({
        title: "Booking deleted",
        description: "The booking has been deleted",
      });
      onActionComplete();
    } catch (error: any) {
      toast({
        title: "Error deleting booking",
        description: error.message || "There was a problem deleting the booking",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {booking.status !== "confirmed" && (
          <DropdownMenuItem onClick={() => handleStatusChange("confirmed")}>
            <Check className="mr-2 h-4 w-4" />
            <span>Confirm Booking</span>
          </DropdownMenuItem>
        )}
        
        {booking.status !== "completed" && (
          <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
            <Check className="mr-2 h-4 w-4" />
            <span>Mark as Completed</span>
          </DropdownMenuItem>
        )}
        
        {booking.status !== "cancelled" && (
          <DropdownMenuItem onClick={() => handleStatusChange("cancelled")}>
            <X className="mr-2 h-4 w-4" />
            <span>Cancel Booking</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem>
          <Calendar className="mr-2 h-4 w-4" />
          <span>Reschedule</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Assign Staff</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="text-destructive" onClick={handleDeleteBooking}>
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete Booking</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BookingActionMenu;
