
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingCalendarView from "@/components/bookings/BookingCalendarView";
import BookingListView from "@/components/bookings/BookingListView";
import BookingFilters from "@/components/bookings/BookingFilters";
import { useBookings } from "@/hooks/useBookings";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, List } from "lucide-react";
import CreateBookingDialog from "@/components/bookings/CreateBookingDialog";
import { BookingStatus } from "@/types/booking.types";

const DashboardBookings = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [activeTab, setActiveTab] = useState<"all-bookings" | "pending-bookings" | "staff-bookings">("all-bookings");
  
  const {
    bookings,
    filteredBookings,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterDate,
    setFilterDate,
    refetch,
    isLoading,
    error
  } = useBookings(activeTab);

  // Helper function to handle filter status changes with string conversion
  const handleFilterStatusChange = (status: string) => {
    setFilterStatus(status as BookingStatus | "all");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">Manage appointments and bookings</p>
        </div>
        
        <div className="flex items-center gap-2 self-start">
          <div className="flex p-1 border rounded-md">
            <Button 
              variant={view === "list" ? "default" : "ghost"}
              size="sm" 
              onClick={() => setView("list")}
              className="rounded-l-sm rounded-r-none"
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button 
              variant={view === "calendar" ? "default" : "ghost"}
              size="sm" 
              onClick={() => setView("calendar")}
              className="rounded-r-sm rounded-l-none"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Calendar
            </Button>
          </div>
          
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList>
          <TabsTrigger value="all-bookings">All Bookings</TabsTrigger>
          <TabsTrigger value="pending-bookings">Pending Bookings</TabsTrigger>
          <TabsTrigger value="staff-bookings">Staff Assigned</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <BookingFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterStatus={filterStatus}
            setFilterStatus={handleFilterStatusChange}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
          />
        </div>

        {view === "list" ? (
          <BookingListView 
            bookings={filteredBookings} 
            isLoading={isLoading}
            onRefresh={refetch}
          />
        ) : (
          <BookingCalendarView 
            bookings={filteredBookings}
            isLoading={isLoading} 
          />
        )}
      </Tabs>

      <CreateBookingDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={refetch}
      />
    </div>
  );
};

export default DashboardBookings;
