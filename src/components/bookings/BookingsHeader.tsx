
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, Calendar, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookingTab } from "@/types/booking.types";
import CreateBookingButton from "./CreateBookingButton";
import { useIsMobile } from "@/hooks/use-mobile";

interface BookingsHeaderProps {
  setActiveTab: (tab: BookingTab) => void;
}

const BookingsHeader: React.FC<BookingsHeaderProps> = ({ setActiveTab }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Bookings</h1>
      
      <div className="flex flex-wrap gap-2">
        <CreateBookingButton />
        
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "sm"}
          onClick={() => setActiveTab("templates")}
          className={isMobile ? "px-2 py-1 h-8 text-xs" : ""}
        >
          <Calendar className="h-4 w-4 mr-1 sm:mr-2" />
          {isMobile ? "Templates" : "Templates"}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "sm"}
              className={isMobile ? "px-2 py-1 h-8 text-xs" : ""}
            >
              <Filter className="h-4 w-4 mr-1 sm:mr-2" />
              {isMobile ? "Filter" : "Filter"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[150px]">
            <DropdownMenuItem onClick={() => setActiveTab("all-bookings")}>
              All Bookings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab("pending-bookings")}>
              Pending Bookings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab("staff-bookings")}>
              Staff Assigned Bookings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default BookingsHeader;
