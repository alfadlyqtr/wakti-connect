
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { UsersRound, TrendingUp } from "lucide-react";
import { BusinessAnalyticsData } from "@/hooks/useBusinessAnalytics";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";

interface AnalyticsSummaryCardsProps {
  isLoading: boolean;
  data: BusinessAnalyticsData;
}

export const AnalyticsSummaryCards: React.FC<AnalyticsSummaryCardsProps> = ({ isLoading, data }) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">{t('common.loading')}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-2">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">{t('common.loading')}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            {t('sidebar.subscribers')}
          </CardTitle>
          <UsersRound className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-3 md:p-4 pt-2">
          <div className="text-lg sm:text-xl md:text-2xl font-bold">{data.subscriberCount || "-"}</div>
          {data.subscriberChangeText && (
            <p className="text-xs text-muted-foreground">
              {data.subscriberChangeText}
            </p>
          )}
          {!data.subscriberChangeText && (
            <p className="text-xs text-muted-foreground">
              {t('dashboard.totalSubscribers')}
            </p>
          )}
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            {t('sidebar.staff')}
          </CardTitle>
          <UsersRound className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-3 md:p-4 pt-2">
          <div className="text-lg sm:text-xl md:text-2xl font-bold">{data.staffCount || "-"}</div>
          {data.staffChangeText && (
            <p className="text-xs text-muted-foreground">
              {data.staffChangeText}
            </p>
          )}
          {!data.staffChangeText && (
            <p className="text-xs text-muted-foreground">
              {t('dashboard.activeStaff')}
            </p>
          )}
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            {t('task.completionRate')}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-3 md:p-4 pt-2">
          <div className="text-lg sm:text-xl md:text-2xl font-bold">
            {data.taskCompletionRate ? `${data.taskCompletionRate}%` : "-"}
          </div>
          {data.completionRateChangeText && (
            <p className="text-xs text-muted-foreground">
              {data.completionRateChangeText}
            </p>
          )}
          {!data.completionRateChangeText && (
            <p className="text-xs text-muted-foreground">
              {t('dashboard.completionRateThis')} {data.timeRange}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
