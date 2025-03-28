
import React from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingWithRelations } from "@/types/booking.types";
import BookingServiceInfo from "./BookingServiceInfo";
import BookingDetailsCard from "./BookingDetailsCard";
import BookingReferenceDisplay from "./BookingReferenceDisplay";

interface ConfirmationCardProps {
  booking: BookingWithRelations;
  serviceName: string;
}

const ConfirmationCard: React.FC<ConfirmationCardProps> = ({ booking, serviceName }) => {
  const navigate = useNavigate();

  return (
    <Card className="border-2 border-primary/10">
      <CardHeader className="text-center bg-primary/5 pb-6">
        <div className="mx-auto bg-green-500 text-white rounded-full h-12 w-12 flex items-center justify-center mb-4">
          <Check className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
        <CardDescription className="text-base">
          Your appointment has been successfully scheduled
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-6">
          <BookingServiceInfo booking={booking} serviceName={serviceName} />
          <BookingDetailsCard booking={booking} />
          <BookingReferenceDisplay bookingId={booking.id} />
          
          {booking.description && (
            <div className="text-sm border-t pt-4">
              <p className="font-medium">Notes:</p>
              <p className="text-muted-foreground">{booking.description}</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex-col space-y-2">
        <Button 
          onClick={() => window.print()} 
          variant="outline" 
          className="w-full"
        >
          Print or Save
        </Button>
        <Button 
          onClick={() => navigate("/")} 
          className="w-full"
        >
          Return to Home
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConfirmationCard;
