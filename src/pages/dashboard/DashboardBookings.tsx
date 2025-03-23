
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Plus, Search, Filter, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useBookings } from "@/hooks/useBookings";
import { BookingTab } from "@/services/booking";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isUserStaff } from "@/utils/staffUtils";

const DashboardBookings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<BookingTab>("all-bookings");
  const [isCreateBookingOpen, setIsCreateBookingOpen] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [staffBookings, setStaffBookings] = useState<any[]>([]);
  
  // Check if user is staff
  useEffect(() => {
    const checkStaffStatus = async () => {
      try {
        setIsLoading(true);
        const staffStatus = await isUserStaff();
        setIsStaff(staffStatus);
        
        if (staffStatus) {
          // Fetch staff-specific bookings
          await fetchStaffBookings();
        }
      } catch (error) {
        console.error("Error checking staff status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkStaffStatus();
  }, []);
  
  const fetchStaffBookings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('staff_assigned_id', user.id)
        .order('start_time', { ascending: true });
        
      if (error) {
        console.error("Error fetching staff bookings:", error);
        toast({
          title: "Error",
          description: `Could not fetch your bookings: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      console.log("Staff bookings:", data);
      setStaffBookings(data || []);
    } catch (error: any) {
      console.error("Error fetching staff bookings:", error);
    }
  };
  
  const {
    filteredBookings,
    isLoading: isBookingsLoading,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterDate,
    setFilterDate,
    createBooking
  } = useBookings(activeTab);

  const handleTabChange = (tab: BookingTab) => {
    setActiveTab(tab);
  };

  const handleCreateBooking = async (bookingData: any) => {
    await createBooking(bookingData);
    setIsCreateBookingOpen(false);
  };
  
  // For staff, use the staff bookings, otherwise use the filtered bookings from hook
  const displayedBookings = isStaff ? staffBookings : filteredBookings;
  const loadingBookings = isLoading || isBookingsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Bookings</h1>
            <p className="text-muted-foreground">
              View your assigned bookings and appointments
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
          <span className="ml-2">Loading bookings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Bookings</h1>
          <p className="text-muted-foreground">
            {isStaff 
              ? "View your assigned bookings and appointments" 
              : "Manage your customer bookings and appointments"}
          </p>
        </div>
        {!isStaff && (
          <Button onClick={() => setIsCreateBookingOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Booking
          </Button>
        )}
      </div>

      {!isStaff && (
        <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search bookings..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Status</h4>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Date</h4>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !filterDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filterDate ? format(filterDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filterDate}
                          onSelect={setFilterDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setFilterStatus("all");
                      setFilterDate(null);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {isStaff ? "Your Assigned Bookings" : "Bookings"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingBookings ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
              <span className="ml-2">Loading bookings...</span>
            </div>
          ) : displayedBookings && displayedBookings.length > 0 ? (
            <div className="grid gap-4">
              {displayedBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{booking.title}</h3>
                    <div className="text-sm text-muted-foreground">
                      {new Date(booking.start_time).toLocaleString()} - {new Date(booking.end_time).toLocaleTimeString()}
                    </div>
                    <div className="mt-1">
                      <span className={cn(
                        "inline-block px-2 py-1 text-xs rounded-full",
                        booking.status === "pending" && "bg-yellow-100 text-yellow-800",
                        booking.status === "confirmed" && "bg-green-100 text-green-800",
                        booking.status === "cancelled" && "bg-red-100 text-red-800",
                        booking.status === "completed" && "bg-blue-100 text-blue-800"
                      )}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button variant="outline" size="sm">Details</Button>
                    {booking.status === "pending" && !isStaff && (
                      <Button size="sm">Confirm</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">No bookings found</p>
              {!isStaff && (
                <Button variant="outline" onClick={() => setIsCreateBookingOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create a booking
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Placeholder for actual booking creation dialog */}
      {isCreateBookingOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Booking</h2>
            <p className="mb-4">This is a placeholder. In a real implementation, this would be a fully featured booking form.</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateBookingOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsCreateBookingOpen(false)}>Create</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardBookings;
