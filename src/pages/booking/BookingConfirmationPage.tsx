
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBookingDetails } from "@/hooks/booking/useBookingDetails";
import ConfirmationCard from "@/components/booking/confirmation/ConfirmationCard";
import LoadingState from "@/components/booking/confirmation/LoadingState";
import ErrorState from "@/components/booking/confirmation/ErrorState";
import { useBusinessStyling } from "@/hooks/useBusinessStyling";

const BookingConfirmationPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { booking, isLoading, error, serviceName } = useBookingDetails({ bookingId });
  
  // Additional validation to make sure we have a valid booking ID
  React.useEffect(() => {
    if (!bookingId) {
      console.error("No booking ID provided in URL");
      navigate("/");
    }
  }, [bookingId, navigate]);
  
  // Reset business styling when unmounting
  useEffect(() => {
    return () => {
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--secondary');
    };
  }, []);

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
