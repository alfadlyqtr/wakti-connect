import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, BellRing, Clock } from "lucide-react";
import { format } from "date-fns";

interface ProfileDataType {
  account_type: "free" | "individual" | "business";
  display_name?: string | null;
  full_name?: string | null;
  business_name?: string | null;
  occupation?: string | null;
}

interface DashboardSummaryCardsProps {
  profileData: ProfileDataType;
  todayTasks: any[];
  upcomingAppointments: any[];
  unreadNotifications: any[];
}

export const DashboardSummaryCards = ({
  profileData,
  todayTasks = [],
  upcomingAppointments = [],
  unreadNotifications = [],
}: DashboardSummaryCardsProps) => {
  // Format the next appointment date if it exists
  const formatNextAppointment = () => {
    if (upcomingAppointments.length === 0) return "No upcoming appointments";
    
    const nextAppointment = upcomingAppointments[0];
    const date = new Date(nextAppointment.start_time);
    
    // If appointment is today, show "Today at [time]"
    if (format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
      return `Today at ${format(date, 'h:mm a')}`;
    }
    
    // Otherwise show the date
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
          <CheckCircle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayTasks.length}</div>
          <p className="text-xs text-muted-foreground">
            {todayTasks.length > 0
              ? `${todayTasks.filter((task: any) => task.status === "completed").length} completed`
              : "No tasks for today"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          <Calendar className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
          <p className="text-xs text-muted-foreground">
            {upcomingAppointments.length > 0
              ? `Next: ${formatNextAppointment()}`
              : "No upcoming appointments"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Notifications</CardTitle>
          <BellRing className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{unreadNotifications.length}</div>
          <p className="text-xs text-muted-foreground">
            {unreadNotifications.length > 0 ? "Unread notifications" : "No new notifications"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Activity</CardTitle>
          <Clock className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">{profileData.account_type}</div>
          <p className="text-xs text-muted-foreground">
            {profileData.account_type === "business"
              ? "Business account"
              : profileData.account_type === "individual"
              ? "Individual account"
              : "Free account"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
