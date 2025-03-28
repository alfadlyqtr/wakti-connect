
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookingWithRelations } from "@/types/booking.types";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import BookingServiceInfo from "./BookingServiceInfo";
import BookingReferenceDisplay from "./BookingReferenceDisplay";
import ConfirmationAnimation from "./ConfirmationAnimation";
import AccountPromotionCard from "./AccountPromotionCard";
import CalendarExportOptions from "./CalendarExportOptions";
import BookingDetailsCard from "./BookingDetailsCard";

interface ConfirmationCardProps {
  booking: BookingWithRelations;
  serviceName: string;
}

const ConfirmationCard: React.FC<ConfirmationCardProps> = ({ booking, serviceName }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [showPromotion, setShowPromotion] = useState(false);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  
  useEffect(() => {
    // If user is not authenticated, show the account promotion
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setShowPromotion(true);
      }, 1500); // Show after animation completes
      
      return () => clearTimeout(timer);
    } else {
      // For authenticated users, auto-integrate with WAKTI calendar
      // This would normally involve saving to user's calendar in the database
      console.log("Auto-adding booking to WAKTI user calendar");
    }
  }, [isAuthenticated]);
  
  const handleCalendarExport = () => {
    setShowPromotion(false);
    setShowCalendarOptions(true);
  };
  
  const handleDone = () => {
    if (isAuthenticated) {
      // Redirect authenticated users to dashboard
      navigate("/dashboard");
    } else {
      // Redirect non-authenticated users to homepage
      navigate("/");
    }
  };

  return (
    <Card className="w-full shadow-md overflow-hidden border-primary/10">
      <CardHeader className="text-center bg-primary/5 pb-6">
        <ConfirmationAnimation />
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        <BookingServiceInfo booking={booking} serviceName={serviceName} />
        
        <BookingDetailsCard booking={booking} />
        
        <BookingReferenceDisplay bookingId={booking.id} />
        
        {showPromotion && !isAuthenticated && (
          <AccountPromotionCard onCalendarExport={handleCalendarExport} />
        )}
        
        {(showCalendarOptions || isAuthenticated) && (
          <CalendarExportOptions booking={booking} serviceName={serviceName} />
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2 p-6 pt-0">
        <Button 
          className="w-full" 
          onClick={handleDone}
        >
          {isAuthenticated ? "Go to Dashboard" : "Return to Home"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConfirmationCard;
