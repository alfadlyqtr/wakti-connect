
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

// Brand color variables for dashboard cards
const CARD_BG =
  "bg-gradient-to-br from-wakti-blue/10 via-wakti-gold/5 to-wakti-beige/10 dark:from-[#202c4a]/80 dark:via-wakti-navy/80 dark:to-[#202c4a]/90";
const CARD_BORDER = "border border-wakti-blue/15 dark:border-wakti-navy/30";
const CARD_HOVER =
  "hover:shadow-lg hover:scale-[1.025] hover:bg-wakti-blue/10 dark:hover:bg-wakti-navy/30";
const CARD_SHADOW =
  "shadow-sm";

export const DashboardSummaryCards = ({
  profileData,
  todayTasks = [],
  unreadNotifications = [],
  isLoading = false
}: DashboardSummaryCardsProps) => {
  // Only count completed tasks if we have tasks
  const tasks = todayTasks || [];
  const completedTasksCount = tasks.filter((task: any) => task.status === "completed").length;
  const notifications = unreadNotifications || [];

  if (isLoading) {
    return (
      <div className="grid gap-3 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className={`${CARD_BG} ${CARD_BORDER} ${CARD_SHADOW}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 py-2">
              <CardTitle className="text-xs font-semibold">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent className="px-3 py-1.5">
              <Skeleton className="h-6 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Responsive grid, tighter gaps, compact padding
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <Card className={`${CARD_BG} ${CARD_BORDER} ${CARD_SHADOW} ${CARD_HOVER} transition-all duration-300 group`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 py-2">
          <CardTitle className="text-xs font-semibold text-wakti-blue">Today's Tasks</CardTitle>
          <CheckCircle className="h-5 w-5 text-wakti-blue group-hover:scale-110 transition-transform" />
        </CardHeader>
        <CardContent className="px-3 py-1.5">
          <div className="text-xl sm:text-2xl font-bold">{tasks.length || 0}</div>
          <p className="text-xs text-muted-foreground">
            {tasks.length > 0
              ? `${completedTasksCount} completed`
              : "No tasks scheduled for today"}
          </p>
        </CardContent>
      </Card>
      <Card className={`${CARD_BG} ${CARD_BORDER} ${CARD_SHADOW} ${CARD_HOVER} transition-all duration-300 group`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 py-2">
          <CardTitle className="text-xs font-semibold text-wakti-gold">Notifications</CardTitle>
          <BellRing className="h-5 w-5 text-wakti-gold group-hover:scale-110 transition-transform" />
        </CardHeader>
        <CardContent className="px-3 py-1.5">
          <div className="text-xl sm:text-2xl font-bold">{notifications.length || 0}</div>
          <p className="text-xs text-muted-foreground">
            {notifications.length > 0 ? "Unread notifications" : "No new notifications"}
          </p>
        </CardContent>
      </Card>
      <Card className={`${CARD_BG} ${CARD_BORDER} ${CARD_SHADOW} ${CARD_HOVER} transition-all duration-300 group`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 py-2">
          <CardTitle className="text-xs font-semibold text-wakti-navy">Account Activity</CardTitle>
          <Clock className="h-5 w-5 text-wakti-navy group-hover:scale-110 transition-transform" />
        </CardHeader>
        <CardContent className="px-3 py-1.5">
          <div className="text-xl sm:text-2xl font-bold capitalize">{profileData?.account_type || "—"}</div>
          <p className="text-xs text-muted-foreground">
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
