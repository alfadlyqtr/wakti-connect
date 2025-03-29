
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { BookingWithRelations, BookingStatus } from "@/types/booking.types";
import BookingsList from "./BookingsList";

interface BookingsTabContentProps {
  bookings: BookingWithRelations[];
  filterFunction?: (booking: BookingWithRelations) => boolean;
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void;
  onAcknowledgeBooking?: (bookingId: string) => void;
  onMarkNoShow?: (bookingId: string) => void;
  isUpdating: boolean;
  isAcknowledging?: boolean;
  isMarkingNoShow?: boolean;
  emptyMessage?: string;
  isStaffTab?: boolean;
}

const BookingsTabContent: React.FC<BookingsTabContentProps> = ({
  bookings,
  filterFunction,
  onUpdateStatus,
  onAcknowledgeBooking,
  onMarkNoShow,
  isUpdating,
  isAcknowledging = false,
  isMarkingNoShow = false,
  emptyMessage = "No bookings found.",
  isStaffTab = false
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStaff, setFilterStaff] = useState<string>("all");
  
  // Get unique staff members for filter
  const staffMembers = React.useMemo(() => {
    const staff = new Set<string>();
    bookings.forEach(booking => {
      if (booking.staff?.name) staff.add(booking.staff.name);
      if (booking.staff_name) staff.add(booking.staff_name);
    });
    return Array.from(staff).sort();
  }, [bookings]);

  // Apply filters
  const filteredBookings = React.useMemo(() => {
    // First, apply prop-based filter if provided
    let filtered = filterFunction ? bookings.filter(filterFunction) : bookings;
    
    // Then apply search filter
    if (searchQuery) {
      filtered = filtered.filter(booking => 
        booking.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (booking.description && booking.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Then apply staff filter if we're on the staff tab
    if (isStaffTab && filterStaff !== "all") {
      filtered = filtered.filter(booking => 
        (booking.staff?.name?.toLowerCase() === filterStaff.toLowerCase()) ||
        (booking.staff_name?.toLowerCase() === filterStaff.toLowerCase())
      );
    }
    
    return filtered;
  }, [bookings, filterFunction, searchQuery, filterStaff, isStaffTab]);

  console.log(`BookingsTabContent: Total bookings: ${bookings.length}, Filtered: ${filteredBookings.length}`);
  
  // Debug: Log bookings with is_template flag
  const templates = bookings.filter(b => (b as any).is_template);
  console.log(`Found ${templates.length} template bookings:`, templates);

  return (
    <div className="space-y-4">
      {/* Filters section */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Search bookings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        
        {isStaffTab && staffMembers.length > 0 && (
          <Select value={filterStaff} onValueChange={setFilterStaff}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff</SelectItem>
              {staffMembers.map(staff => (
                <SelectItem key={staff} value={staff.toLowerCase()}>
                  {staff}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      
      {/* Bookings list or empty state */}
      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">{emptyMessage}</p>
          </CardContent>
        </Card>
      ) : (
        <BookingsList 
          bookings={filteredBookings} 
          onUpdateStatus={onUpdateStatus}
          onAcknowledgeBooking={onAcknowledgeBooking}
          onMarkNoShow={onMarkNoShow}
          isUpdating={isUpdating}
          isAcknowledging={isAcknowledging}
          isMarkingNoShow={isMarkingNoShow}
        />
      )}
    </div>
  );
};

export default BookingsTabContent;
