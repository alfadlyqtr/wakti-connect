
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookingTab } from "@/types/booking.types";

interface BookingsHeaderProps {
  setActiveTab: (tab: BookingTab) => void;
}

const BookingsHeader: React.FC<BookingsHeaderProps> = ({ setActiveTab }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Bookings</h1>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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
  );
};

export default BookingsHeader;
