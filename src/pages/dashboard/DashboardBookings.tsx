
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Plus, Search, Filter } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useBookings } from "@/hooks/useBookings";
import { BookingTab } from "@/services/booking";

const DashboardBookings = () => {
  const [activeTab, setActiveTab] = useState<BookingTab>("all-bookings");
  const [isCreateBookingOpen, setIsCreateBookingOpen] = useState(false);
  
  const {
    filteredBookings,
    isLoading,
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Bookings</h1>
          <p className="text-muted-foreground">
            Manage your customer bookings and appointments
          </p>
        </div>
        <Button onClick={() => setIsCreateBookingOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Booking
        </Button>
      </div>

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

      <Tabs defaultValue="all-bookings" onValueChange={(v) => handleTabChange(v as BookingTab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all-bookings">All Bookings</TabsTrigger>
          <TabsTrigger value="pending-bookings">Pending</TabsTrigger>
          <TabsTrigger value="staff-bookings">Staff Assigned</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredBookings.length > 0 ? (
                <div className="grid gap-4">
                  {filteredBookings.map((booking) => (
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
                        {booking.status === "pending" && (
                          <Button size="sm">Confirm</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground mb-4">No bookings found</p>
                  <Button variant="outline" onClick={() => setIsCreateBookingOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create a booking
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
