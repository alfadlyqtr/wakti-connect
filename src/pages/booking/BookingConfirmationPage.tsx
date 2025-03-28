
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Calendar, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { BookingWithRelations } from "@/types/booking.types";
import { toast } from "@/components/ui/use-toast";

const BookingConfirmationPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Try to get booking data from location state or fetch it
  useEffect(() => {
    const fetchBooking = async () => {
      setIsLoading(true);
      
      try {
        // Check if we have booking data in state
        if (location.state?.booking) {
          setBooking(location.state.booking);
          return;
        }
        
        // Otherwise fetch from database
        if (!bookingId) {
          throw new Error("Booking ID is missing");
        }
        
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            service:service_id (
              name,
              description,
              price
            ),
            staff:staff_assigned_id (
              name
            )
          `)
          .eq('id', bookingId)
          .single();
          
        if (error) throw error;
        if (!data) throw new Error("Booking not found");
        
        // Prepare the booking object with properly typed relations
        const formattedBooking: BookingWithRelations = {
          ...data,
          service: null,
          staff: null
        };
        
        // Check if service is valid and assign it
        if (data.service && typeof data.service === 'object' && !('error' in data.service)) {
          formattedBooking.service = {
            name: data.service.name,
            description: data.service.description,
            price: data.service.price
          };
        } else if (data.service && 'error' in data.service) {
          console.warn("Service relation error:", data.service);
        }
        
        // Check if staff is valid and assign it
        if (data.staff && typeof data.staff === 'object' && !('error' in data.staff)) {
          formattedBooking.staff = {
            name: data.staff.name
          };
        } else if (data.staff && 'error' in data.staff) {
          console.warn("Staff relation error:", data.staff);
        }
        
        setBooking(formattedBooking);
      } catch (err: any) {
        console.error("Error fetching booking:", err);
        setError(err.message || "Failed to load booking information");
        toast({
          title: "Error",
          description: "There was a problem loading the booking details",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, location.state]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Booking Not Found</CardTitle>
            <CardDescription>
              {error || "The requested booking information could not be found."}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/")}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const startTime = new Date(booking.start_time);
  const endTime = new Date(booking.end_time);
  const serviceName = booking.service?.name || location.state?.templateName || "Service";

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
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
            <div className="text-center">
              <h3 className="text-xl font-medium">{serviceName}</h3>
              <p className="text-muted-foreground">
                {booking.service?.price ? `$${booking.service.price.toFixed(2)}` : "Free"}
              </p>
            </div>
            
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex">
                <Calendar className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-muted-foreground">{format(startTime, "EEEE, MMMM d, yyyy")}</p>
                </div>
              </div>
              
              <div className="flex">
                <Clock className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-muted-foreground">
                    {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
                  </p>
                </div>
              </div>
              
              {booking.staff && (
                <div className="flex">
                  <div className="h-5 w-5 mr-3 text-primary flex items-center justify-center">👤</div>
                  <div>
                    <p className="font-medium">Staff</p>
                    <p className="text-muted-foreground">{booking.staff.name}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center bg-muted/30 p-4 rounded-lg">
              <p className="text-sm mb-2">Booking Reference:</p>
              <p className="font-mono text-xs bg-background p-2 rounded">{booking.id}</p>
            </div>
            
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
    </div>
  );
};

export default BookingConfirmationPage;
