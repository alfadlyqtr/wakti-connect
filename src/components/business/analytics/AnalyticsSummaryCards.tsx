
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { UsersRound, TrendingUp, Bell } from "lucide-react";
import { BusinessAnalyticsData } from "@/hooks/useBusinessAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/utils/businessReportsUtils";
import { useDashboardNotifications } from "@/hooks/useDashboardNotifications";

interface AnalyticsSummaryCardsProps {
  isLoading: boolean;
  data: BusinessAnalyticsData;
}

export const AnalyticsSummaryCards: React.FC<AnalyticsSummaryCardsProps> = ({
  isLoading,
  data,
}) => {
  const { unreadCount, isLoading: notificationsLoading } = useDashboardNotifications();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.025]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-2">
              <Skeleton className="h-6 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.025]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            Notifications
          </CardTitle>
          <Bell className="h-4 w-4 text-wakti-gold" />
        </CardHeader>
        <CardContent className="p-3 md:p-4 pt-2">
          <div className="text-lg sm:text-xl md:text-2xl font-bold">
            {notificationsLoading ? <Skeleton className="h-6 w-12" /> : unreadCount}
          </div>
          <p className="text-xs text-muted-foreground">
            {unreadCount > 0 ? "Unread notifications" : "No new notifications"}
          </p>
        </CardContent>
      </Card>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.025]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            Subscribers
          </CardTitle>
          <UsersRound className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent className="p-3 md:p-4 pt-2">
          <div className="text-lg sm:text-xl md:text-2xl font-bold">
            {formatNumber(data.subscriberCount)}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.subscriberChangeText ?? "Total subscribers"}
          </p>
        </CardContent>
      </Card>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.025]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            Staff
          </CardTitle>
          <UsersRound className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent className="p-3 md:p-4 pt-2">
          <div className="text-lg sm:text-xl md:text-2xl font-bold">
            {formatNumber(data.staffCount)}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.staffChangeText ?? "Active staff members"}
          </p>
        </CardContent>
      </Card>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.025]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            Task Completion Rate
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent className="p-3 md:p-4 pt-2">
          <div className="text-lg sm:text-xl md:text-2xl font-bold">
            {data.taskCompletionRate !== null ? `${data.taskCompletionRate}%` : "—"}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.completionRateChangeText ?? "No tasks found"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
