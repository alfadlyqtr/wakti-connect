
import React from "react";

interface BookingReferenceDisplayProps {
  bookingId: string;
}

const BookingReferenceDisplay: React.FC<BookingReferenceDisplayProps> = ({ bookingId }) => {
  return (
    <div className="text-center bg-muted/30 p-4 rounded-lg">
      <p className="text-sm mb-2">Booking Reference:</p>
      <p className="font-mono text-xs bg-background p-2 rounded">{bookingId}</p>
    </div>
  );
};

export default BookingReferenceDisplay;
