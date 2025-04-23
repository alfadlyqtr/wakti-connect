
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, BellRing, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardNotifications } from "@/hooks/useDashboardNotifications";

// Props and types retained for live data, not static
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
  subscribersCount?: number;
}

// Style for compact, uniform card appearance—matches Reminders
const CARD_COMMON =
  "rounded-lg border bg-card text-card-foreground shadow-sm group transition-all duration-300 hover:shadow-lg hover:scale-[1.025]";
const CARD_HEADER = "flex flex-row items-center justify-between space-y-0 pb-2 px-3 py-2";
const CARD_CONTENT = "px-3 py-1.5";

export const DashboardSummaryCards = ({
  profileData,
  todayTasks = [],
  unreadNotifications = [],
  isLoading = false,
  subscribersCount = 0
}: DashboardSummaryCardsProps) => {
  // Live counts from props only (no dummy data)
  const tasks = todayTasks || [];
  const completedTasksCount = tasks.filter((task: any) => task.status === "completed").length;
  const { unreadCount, isLoading: notifLoading } = useDashboardNotifications();

  // Loading skeletons - always show same number and size as actual cards
  if (isLoading) {
    return (
      <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className={CARD_COMMON}>
            <CardHeader className={CARD_HEADER}>
              <CardTitle className="text-xs font-semibold">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent className={CARD_CONTENT}>
              <Skeleton className="h-6 w-14 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
      {/* Today's Tasks */}
      <Card className={CARD_COMMON}>
        <CardHeader className={CARD_HEADER}>
          <CardTitle className="text-xs font-semibold text-wakti-blue">Today's Tasks</CardTitle>
          <CheckCircle className="h-5 w-5 text-wakti-blue group-hover:scale-110 transition-transform" />
        </CardHeader>
        <CardContent className={CARD_CONTENT}>
          <div className="text-xl md:text-2xl font-bold">{tasks.length || 0}</div>
          <p className="text-xs text-muted-foreground">
            {tasks.length > 0
              ? `${completedTasksCount} completed`
              : "No tasks for today"}
          </p>
        </CardContent>
      </Card>

      {/* Notifications (new card) */}
      <Card className={CARD_COMMON}>
        <CardHeader className={CARD_HEADER}>
          <CardTitle className="text-xs font-semibold text-wakti-gold">Notifications</CardTitle>
          <BellRing className="h-5 w-5 text-wakti-gold group-hover:scale-110 transition-transform" />
        </CardHeader>
        <CardContent className={CARD_CONTENT}>
          <div className="text-xl md:text-2xl font-bold">
            {notifLoading ? <Skeleton className="h-6 w-12" /> : unreadCount}
          </div>
          <p className="text-xs text-muted-foreground">
            {unreadCount > 0 ? "Unread notifications" : "No new notifications"}
          </p>
        </CardContent>
      </Card>

      {/* Subscribers */}
      <Card className={CARD_COMMON}>
        <CardHeader className={CARD_HEADER}>
          <CardTitle className="text-xs font-semibold text-blue-500">Subscribers</CardTitle>
          <Users className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
        </CardHeader>
        <CardContent className={CARD_CONTENT}>
          <div className="text-xl md:text-2xl font-bold">{subscribersCount}</div>
          <p className="text-xs text-muted-foreground">
            Total subscribers
          </p>
        </CardContent>
      </Card>

      {/* Account Activity */}
      <Card className={CARD_COMMON}>
        <CardHeader className={CARD_HEADER}>
          <CardTitle className="text-xs font-semibold text-wakti-navy">
            Account Type
          </CardTitle>
          <Users className="h-5 w-5 text-wakti-navy group-hover:scale-110 transition-transform" />
        </CardHeader>
        <CardContent className={CARD_CONTENT}>
          <div className="text-xl md:text-2xl font-bold capitalize">
            {profileData?.account_type || "—"}
          </div>
          <p className="text-xs text-muted-foreground capitalize">
            {profileData?.account_type
              ? `${profileData.account_type} Account`
              : "Account type not set"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
