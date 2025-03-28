
import React from "react";
import { BookingWithRelations } from "@/types/booking.types";

interface BookingServiceInfoProps {
  booking: BookingWithRelations;
  serviceName: string;
}

const BookingServiceInfo: React.FC<BookingServiceInfoProps> = ({ booking, serviceName }) => {
  return (
    <div className="text-center">
      <h3 className="text-xl font-medium">{serviceName}</h3>
      <p className="text-muted-foreground">
        {booking.service?.price ? `$${booking.service.price.toFixed(2)}` : "Free"}
      </p>
    </div>
  );
};

export default BookingServiceInfo;
