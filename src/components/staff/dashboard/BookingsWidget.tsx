
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Filter, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { getStaffBusinessId } from "@/utils/staffUtils";
import { format } from "date-fns";

const BookingsWidget = () => {
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUpcomingBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get business ID for the staff member
        const businessId = await getStaffBusinessId();
        
        if (!businessId) {
          console.error("Could not get business ID for staff");
          setError("Could not determine your business");
          setIsLoading(false);
          return;
        }
        
        // Get the current user's ID
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError("Authentication required");
          setIsLoading(false);
          return;
        }
        
        // Get current date in ISO format for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayIso = today.toISOString();
        
        // Fetch bookings where this staff member is assigned
        // and the start time is in the future
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('business_id', businessId)
          .eq('staff_assigned_id', user.id)
          .gte('start_time', todayIso)
          .order('start_time', { ascending: true })
          .limit(5);
          
        if (bookingsError) {
          console.error("Error fetching bookings:", bookingsError);
          setError("Failed to load bookings");
          setIsLoading(false);
          return;
        }
        
        setUpcomingBookings(bookings || []);
      } catch (err) {
        console.error("Error in booking widget:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUpcomingBookings();
    
    // Set up a refresh interval
    const interval = setInterval(fetchUpcomingBookings, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const formatBookingTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">Your Upcoming Bookings</CardTitle>
          {upcomingBookings.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {upcomingBookings.length} new
            </Badge>
          )}
        </div>
        <Link to="/dashboard/bookings">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-6 text-center">
            <div className="h-8 w-8 mx-auto mb-2 border-4 border-t-transparent border-blue-400 rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="py-6 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : upcomingBookings.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">No upcoming bookings found</p>
            <Link to="/dashboard/bookings" className="mt-4 inline-block">
              <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Booking
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="flex items-start justify-between border-b pb-3">
                <div>
                  <h3 className="font-medium">{booking.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatBookingTime(booking.start_time)}
                  </p>
                </div>
                <Badge variant={booking.status === "confirmed" ? "default" : "outline"}>
                  {booking.status === "confirmed" ? "Confirmed" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingsWidget;
