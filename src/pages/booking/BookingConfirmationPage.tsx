
import React from "react";
import { useParams } from "react-router-dom";
import { useBookingDetails } from "@/hooks/booking/useBookingDetails";
import ConfirmationCard from "@/components/booking/confirmation/ConfirmationCard";
import LoadingState from "@/components/booking/confirmation/LoadingState";
import ErrorState from "@/components/booking/confirmation/ErrorState";

const BookingConfirmationPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { booking, isLoading, error, serviceName } = useBookingDetails({ bookingId });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !booking) {
    return <ErrorState errorMessage={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <ConfirmationCard booking={booking} serviceName={serviceName} />
    </div>
  );
};

export default BookingConfirmationPage;
