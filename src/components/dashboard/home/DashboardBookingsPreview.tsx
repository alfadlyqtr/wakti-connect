
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRole } from "@/types/user";
import { useBookings } from "@/hooks/useBookings";
import { format } from "date-fns";

interface DashboardBookingsPreviewProps {
  userRole: UserRole;
}

const DashboardBookingsPreview: React.FC<DashboardBookingsPreviewProps> = ({ userRole }) => {
  const navigate = useNavigate();
  const isBusinessAccount = userRole === "business" || userRole === "superadmin";
  
  const { 
    bookings, 
    isLoading 
  } = useBookings();
  
  // Get only upcoming bookings (bookings with start_time in the future)
  const upcomingBookings = (bookings || [])
    .filter(booking => {
      const bookingDate = new Date(booking.start_time);
      return bookingDate > new Date() && booking.status !== 'cancelled' && booking.status !== 'no_show';
    })
    .slice(0, 3); // Limit to 3 bookings
  
  return (
    <Card className="bg-gradient-to-br from-[#33C3F0]/10 via-white/80 to-[#1EAEDB]/10 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          Upcoming Bookings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[220px]">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 animate-pulse h-[72px]"></div>
              ))}
            </div>
          ) : upcomingBookings.length > 0 ? (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{booking.title}</h4>
                      {booking.customer_name && isBusinessAccount && (
                        <p className="text-sm text-muted-foreground">{booking.customer_name}</p>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {format(new Date(booking.start_time), 'h:mm a')}
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">
                      {booking.status}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(booking.start_time), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming bookings
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 pt-3 pb-3">
        <Button 
          size="sm" 
          className="ml-auto"
          onClick={() => navigate('/dashboard/bookings')}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          {isBusinessAccount ? "Manage Bookings" : "View All Bookings"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DashboardBookingsPreview;
