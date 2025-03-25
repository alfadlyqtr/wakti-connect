import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, Calendar, Clock, UserCheck } from "lucide-react";
import { format, parseISO } from "date-fns";
import { BookingWithRelations } from "@/types/booking.types";

const BookingConfirmationPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  
  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      if (!bookingId) throw new Error("Booking ID is required");
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          service:service_id(name, description, price),
          staff:staff_assigned_id(name)
        `)
        .eq('id', bookingId)
        .single();
        
      if (error) throw error;
      
      // Handle potential errors with relations by providing default values
      const bookingWithSafeRelations: BookingWithRelations = {
        ...data,
        service: data.service && typeof data.service === 'object' ? data.service : null,
        staff: data.staff && typeof data.staff === 'object' ? data.staff : null
      };
      
      return bookingWithSafeRelations;
    },
    enabled: !!bookingId
  });

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container max-w-2xl mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Booking Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The booking you are looking for could not be found.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/')}>Return Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Get service name safely
  const serviceName = booking.service?.name || 'Service';
  // Get staff name safely
  const staffName = booking.staff?.name || 'To be assigned';
  // Get price safely
  const servicePrice = booking.service?.price || null;

  return (
    <div className="container max-w-2xl mx-auto py-12">
      <Card className="border-green-100">
        <CardHeader className="text-center pb-2">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl text-green-700">Booking Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground mb-6">
            Your booking request has been submitted and is awaiting confirmation.
            You will receive a notification once it's confirmed.
          </p>
          
          <div className="bg-muted p-6 rounded-lg space-y-4">
            <h3 className="font-medium text-lg">{serviceName}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(booking.start_time), 'PPP')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(booking.start_time), 'p')} - {format(parseISO(booking.end_time), 'p')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <UserCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Service Provider</p>
                  <p className="text-sm text-muted-foreground">
                    {staffName}
                  </p>
                </div>
              </div>
            </div>
            
            {servicePrice && (
              <div className="mt-4 pt-4 border-t">
                <p className="flex justify-between">
                  <span className="font-medium">Price:</span>
                  <span>QAR {servicePrice.toFixed(2)}</span>
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md text-blue-700 text-sm">
            <p>
              <strong>Note:</strong> Your booking is currently pending approval by the service provider.
              You will receive a confirmation once it's approved.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/')} variant="outline">
            Return Home
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingConfirmationPage;
