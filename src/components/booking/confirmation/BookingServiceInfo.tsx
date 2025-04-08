
import React from "react";
import { BookingWithRelations } from "@/types/booking.types";
import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";

interface BookingServiceInfoProps {
  booking: BookingWithRelations;
  serviceName: string;
}

const BookingServiceInfo: React.FC<BookingServiceInfoProps> = ({ 
  booking, 
  serviceName 
}) => {
  // Ensure we pass the business_id to the useCurrencyFormat hook
  const { formatCurrency } = useCurrencyFormat({ 
    businessId: booking.business_id 
  });
  
  // Get the price, checking both service and the booking itself
  const price = booking.service?.price || booking.price || null;
  
  // Get staff name from either the relation or the direct field
  const staffName = booking.staff?.name || booking.staff_name;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{serviceName}</h3>
        {price !== null && (
          <span className="font-bold text-primary">
            {formatCurrency(price)}
          </span>
        )}
      </div>
      
      {(booking.service?.description || booking.description) && (
        <p className="text-muted-foreground text-sm">
          {booking.service?.description || booking.description}
        </p>
      )}
      
      {staffName && (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Staff:</span> {staffName}
        </div>
      )}
      
      {booking.customer_name && (
        <div className="pb-1 text-sm">
          <span className="text-muted-foreground">Booked For:</span> {booking.customer_name}
        </div>
      )}
      
      {booking.customer_phone && (
        <div className="text-sm">
          <span className="text-muted-foreground">Phone:</span> {booking.customer_phone}
        </div>
      )}
    </div>
  );
};

export default BookingServiceInfo;
