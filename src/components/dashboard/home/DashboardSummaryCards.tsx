
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, BellRing, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileDataType {
  account_type: "free" | "individual" | "business";
  display_name?: string | null;
  full_name?: string | null;
  business_name?: string | null;
  occupation?: string | null;
}

interface DashboardSummaryCardsProps {
  profileData: ProfileDataType | undefined;
  todayTasks: any[] | undefined;
  unreadNotifications: any[] | undefined;
  isLoading?: boolean;
}

export const DashboardSummaryCards = ({
  profileData,
  todayTasks = [],
  unreadNotifications = [],
  isLoading = false
}: DashboardSummaryCardsProps) => {
  // Ensure we have valid arrays
  const tasks = todayTasks || [];
  const notifications = unreadNotifications || [];
  
  // Only count completed tasks if we have tasks
  const completedTasksCount = tasks.filter((task: any) => task.status === "completed").length;
  
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-32" />
              </CardTitle>
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Today's Tasks</CardTitle>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400/30 to-blue-600/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <CheckCircle className="h-4 w-4 text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{tasks.length || 0}</div>
          <p className="text-xs text-blue-200/70">
            {tasks.length > 0
              ? `${completedTasksCount} completed`
              : "No tasks scheduled for today"}
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Notifications</CardTitle>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400/30 to-indigo-600/30 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <BellRing className="h-4 w-4 text-indigo-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{notifications.length || 0}</div>
          <p className="text-xs text-blue-200/70">
            {notifications.length > 0 ? "Unread notifications" : "No new notifications"}
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Account Activity</CardTitle>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400/30 to-teal-600/30 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.3)]">
            <Clock className="h-4 w-4 text-teal-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white capitalize">{profileData?.account_type || "—"}</div>
          <p className="text-xs text-blue-200/70">
            {profileData?.account_type === "business"
              ? "Business Account"
              : profileData?.account_type === "individual"
              ? "Individual Account"
              : profileData?.account_type === "free" 
              ? "Free Account" 
              : "Account type not set"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
