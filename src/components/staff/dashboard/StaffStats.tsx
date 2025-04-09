
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CalendarClock } from "lucide-react";

interface StaffStatsProps {
  stats: any; // Stats data from the API
  permissions: Record<string, boolean>;
}

const StaffStats: React.FC<StaffStatsProps> = ({ stats = {}, permissions = {} }) => {
  // Format time to display hours, minutes, and seconds
  const formatWorkTime = (totalHours: number | undefined) => {
    if (totalHours === undefined) return '--:--:--';
    
    const hours = Math.floor(totalHours);
    const minutes = Math.floor((totalHours - hours) * 60);
    const seconds = Math.floor(((totalHours - hours) * 60 - minutes) * 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Hours Worked */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Time Worked</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold">
              {formatWorkTime(stats?.hoursWorked)}
            </span>
            <span className="text-sm text-muted-foreground ml-1">this month</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Active Bookings (if user has booking permissions) */}
      {(permissions.can_manage_bookings || permissions.can_view_customer_bookings) && (
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarClock className="h-5 w-5 text-amber-500" />
              <span className="font-medium">Active Bookings</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">
                {stats?.activeBookings !== undefined ? stats.activeBookings : '--'}
              </span>
              <span className="text-sm text-muted-foreground ml-1">upcoming</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StaffStats;
