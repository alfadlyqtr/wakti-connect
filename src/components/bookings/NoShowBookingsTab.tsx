
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookingWithRelations, BookingStatus } from "@/types/booking.types";
import BookingsList from "./BookingsList";

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
    <BookingsList 
      bookings={noShowBookings} 
      onUpdateStatus={() => {}} // No-shows can't have their status updated directly
      isUpdating={false}
      isNoShowTab={true}
      onApproveNoShow={onApproveNoShow}
      onRejectNoShow={onRejectNoShow}
      isApproving={isApproving}
      isRejecting={isRejecting}
    />
  );
};

export default NoShowBookingsTab;
