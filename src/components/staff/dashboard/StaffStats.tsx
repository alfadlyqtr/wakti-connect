
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ClipboardList, PieChart, CalendarClock } from "lucide-react";

interface StaffStatsProps {
  stats: any; // Stats data from the API
  permissions: Record<string, boolean>;
}

const StaffStats: React.FC<StaffStatsProps> = ({ stats = {}, permissions = {} }) => {
  // Create stat cards based on permissions
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {/* Hours Worked */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Hours Worked</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold">
              {stats?.hoursWorked !== undefined ? stats.hoursWorked : '--'}
            </span>
            <span className="text-sm text-muted-foreground ml-1">this month</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Tasks Completed (if user has task permissions) */}
      {(permissions.can_view_tasks || permissions.can_manage_tasks) && (
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ClipboardList className="h-5 w-5 text-green-500" />
              <span className="font-medium">Tasks Completed</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">
                {stats?.tasksCompleted !== undefined ? stats.tasksCompleted : '--'}
              </span>
              <span className="text-sm text-muted-foreground ml-1">this week</span>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Completion Rate (if user has task permissions) */}
      {(permissions.can_view_tasks || permissions.can_manage_tasks) && (
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Completion Rate</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">
                {stats?.completionRate !== undefined ? `${stats.completionRate}%` : '--'}
              </span>
              <span className="text-sm text-muted-foreground ml-1">tasks</span>
            </div>
          </CardContent>
        </Card>
      )}
      
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
