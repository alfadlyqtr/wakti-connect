
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, Calendar, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookingTab } from "@/types/booking.types";
import CreateBookingButton from "./CreateBookingButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";

interface BookingsHeaderProps {
  setActiveTab: (tab: BookingTab) => void;
}

const BookingsHeader: React.FC<BookingsHeaderProps> = ({ setActiveTab }) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold">{t('booking.title')}</h1>
      
      <div className="flex flex-wrap gap-2">
        <CreateBookingButton />
        
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "sm"}
          onClick={() => setActiveTab("templates")}
          className={isMobile ? "px-2 py-1 h-8 text-xs" : ""}
        >
          <Calendar className="h-4 w-4 mr-1 sm:mr-2" />
          {isMobile ? t('booking.templates') : t('booking.templates')}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "sm"}
              className={isMobile ? "px-2 py-1 h-8 text-xs" : ""}
            >
              <Filter className="h-4 w-4 mr-1 sm:mr-2" />
              {isMobile ? t('booking.filter') : t('booking.filter')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[150px]">
            <DropdownMenuItem onClick={() => setActiveTab("all-bookings")}>
              {t('booking.allBookings')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab("pending-bookings")}>
              {t('booking.pending')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab("staff-bookings")}>
              {t('booking.staffAssigned')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default BookingsHeader;
