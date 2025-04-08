
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, BellRing, Clock } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface ProfileDataType {
  account_type: "free" | "individual" | "business";
  display_name?: string | null;
  full_name?: string | null;
  business_name?: string | null;
  occupation?: string | null;
}

interface DashboardSummaryCardsProps {
  profileData: ProfileDataType;
  todayTasks: any[] | undefined;
  unreadNotifications: any[] | undefined;
}

export const DashboardSummaryCards = ({
  profileData,
  todayTasks = [],
  unreadNotifications = [],
}: DashboardSummaryCardsProps) => {
  const { t } = useTranslation();
  
  // Ensure we have valid arrays
  const tasks = todayTasks || [];
  const notifications = unreadNotifications || [];
  
  // Only count completed tasks if we have tasks
  const completedTasksCount = tasks.filter((task: any) => task.status === "completed").length;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('task.today')}</CardTitle>
          <CheckCircle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tasks.length}</div>
          <p className="text-xs text-muted-foreground">
            {tasks.length > 0
              ? `${completedTasksCount} ${t('dashboard.completed')}`
              : t('dashboard.noTasksToday')}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('dashboard.notifications')}</CardTitle>
          <BellRing className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{notifications.length}</div>
          <p className="text-xs text-muted-foreground">
            {notifications.length > 0 ? t('dashboard.unreadNotifications') : t('dashboard.noNewNotifications')}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('dashboard.activity')}</CardTitle>
          <Clock className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">{profileData?.account_type || "free"}</div>
          <p className="text-xs text-muted-foreground">
            {profileData?.account_type === "business"
              ? t('dashboard.businessAccount')
              : profileData?.account_type === "individual"
              ? t('dashboard.individualAccount')
              : t('dashboard.freeAccount')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
