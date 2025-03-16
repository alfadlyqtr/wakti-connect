
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, BellRing, Clock } from "lucide-react";

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
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
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
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
          <p className="text-xs text-muted-foreground">
            {upcomingAppointments.length > 0
              ? `Next: ${new Date(upcomingAppointments[0].start_time).toLocaleDateString()}`
              : "No upcoming appointments"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Notifications</CardTitle>
          <BellRing className="h-4 w-4 text-muted-foreground" />
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
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Active</div>
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
