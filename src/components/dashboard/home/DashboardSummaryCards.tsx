
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
      <Card className="bg-black/20 backdrop-blur-xl border-white/10 overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300" 
        style={{
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
          transform: 'perspective(1000px) rotateX(2deg)'
        }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Today's Tasks</CardTitle>
          <CheckCircle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{tasks.length || 0}</div>
          <p className="text-xs text-blue-200/60">
            {tasks.length > 0
              ? `${completedTasksCount} completed`
              : "No tasks scheduled for today"}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-black/20 backdrop-blur-xl border-white/10 overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300" 
        style={{
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
          transform: 'perspective(1000px) rotateX(2deg)'
        }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Notifications</CardTitle>
          <BellRing className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{notifications.length || 0}</div>
          <p className="text-xs text-blue-200/60">
            {notifications.length > 0 ? "Unread notifications" : "No new notifications"}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-black/20 backdrop-blur-xl border-white/10 overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300" 
        style={{
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
          transform: 'perspective(1000px) rotateX(2deg)'
        }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Account Activity</CardTitle>
          <Clock className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white capitalize">{profileData?.account_type || "—"}</div>
          <p className="text-xs text-blue-200/60">
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
