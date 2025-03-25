
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookingWithRelations, BookingStatus } from "@/types/booking.types";
import BookingsList from "./BookingsList";

interface BookingsTabContentProps {
  bookings: BookingWithRelations[];
  filterFunction?: (booking: BookingWithRelations) => boolean;
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void;
  isUpdating: boolean;
  emptyMessage?: string;
}

const BookingsTabContent: React.FC<BookingsTabContentProps> = ({
  bookings,
  filterFunction,
  onUpdateStatus,
  isUpdating,
  emptyMessage = "No bookings found."
}) => {
  // Apply filter if provided, otherwise use all bookings
  const filteredBookings = filterFunction 
    ? bookings.filter(filterFunction) 
    : bookings;

  if (filteredBookings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <BookingsList 
      bookings={filteredBookings} 
      onUpdateStatus={onUpdateStatus}
      isUpdating={isUpdating}
    />
  );
};

export default BookingsTabContent;
