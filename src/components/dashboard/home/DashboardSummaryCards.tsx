
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface DashboardSummaryCardsProps {
  profileData: {
    account_type: "free" | "individual" | "business";
  } | null;
  todayTasks: any[] | null;
  upcomingAppointments: any[] | null;
  unreadNotifications: any[] | null;
}

export const DashboardSummaryCards = ({ 
  profileData, 
  todayTasks, 
  upcomingAppointments, 
  unreadNotifications 
}: DashboardSummaryCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Account Type
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">
            {profileData?.account_type || "Free"}
          </div>
          <p className="text-xs text-muted-foreground">
            {profileData?.account_type === 'free' ? 'Upgrade for more features!' : 
             profileData?.account_type === 'individual' ? 'Personal plan with extended features' : 
             'Full access to all business features'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Today's Tasks
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M8 12h8M12 8v8" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayTasks?.length || 0}</div>
          <p className="text-xs text-muted-foreground">
            {todayTasks?.length 
              ? `${todayTasks.length} tasks due today` 
              : "No tasks scheduled for today"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Upcoming Appointments
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 18V6m0 12 3-3m-3 3-3-3M8 6v12m0-12L5 9m3-3 3 3" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingAppointments?.length || 0}</div>
          <p className="text-xs text-muted-foreground">
            {upcomingAppointments?.length && upcomingAppointments[0]?.start_time
              ? `Next: ${format(new Date(upcomingAppointments[0].start_time), 'MMM d, h:mm a')}`
              : "No upcoming appointments"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Unread Notifications
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{unreadNotifications?.length || 0}</div>
          <p className="text-xs text-muted-foreground">
            {unreadNotifications?.length
              ? `${unreadNotifications.length} unread notifications`
              : "No unread notifications"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
