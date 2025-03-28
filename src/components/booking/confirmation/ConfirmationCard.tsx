
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookingWithRelations } from "@/types/booking.types";
import { format } from "date-fns";
import { Check, Calendar, Clock } from "lucide-react";
import BookingServiceInfo from "./BookingServiceInfo";
import BookingReferenceDisplay from "./BookingReferenceDisplay";

interface ConfirmationCardProps {
  booking: BookingWithRelations;
  serviceName: string;
}

const ConfirmationCard: React.FC<ConfirmationCardProps> = ({ booking, serviceName }) => {
  const navigate = useNavigate();
  
  const formattedDate = booking.start_time 
    ? format(new Date(booking.start_time), "EEEE, MMMM d, yyyy")
    : "Date not available";
    
  const formattedTime = booking.start_time && booking.end_time
    ? `${format(new Date(booking.start_time), "h:mm a")} - ${format(new Date(booking.end_time), "h:mm a")}`
    : "Time not available";

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Check className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Booking Confirmed</CardTitle>
        <CardDescription>
          Your booking has been successfully confirmed.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <BookingServiceInfo booking={booking} serviceName={serviceName} />
        
        <div className="border-t border-b py-4 space-y-4">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
            <div>
              <p className="font-medium">Date</p>
              <p className="text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
            <div>
              <p className="font-medium">Time</p>
              <p className="text-muted-foreground">{formattedTime}</p>
            </div>
          </div>
        </div>
        
        <BookingReferenceDisplay bookingId={booking.id} />
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          className="w-full" 
          onClick={() => navigate("/")}
        >
          Return to Home
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConfirmationCard;
