
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { UsersRound, TrendingUp } from "lucide-react";
import { BusinessAnalyticsData } from "@/hooks/useBusinessAnalytics";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/utils/businessReportsUtils";

interface AnalyticsSummaryCardsProps {
  isLoading: boolean;
  data: BusinessAnalyticsData;
}

export const AnalyticsSummaryCards: React.FC<AnalyticsSummaryCardsProps> = ({ isLoading, data }) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
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
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
      <Card className="overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-white">
            Subscribers
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400/30 to-blue-600/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <UsersRound className="h-4 w-4 text-blue-400" />
          </div>
        </CardHeader>
        <CardContent className="p-3 md:p-4 pt-2">
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{formatNumber(data.subscriberCount)}</div>
          {data.subscriberChangeText ? (
            <p className="text-xs text-blue-200/70">
              {data.subscriberChangeText}
            </p>
          ) : (
            <p className="text-xs text-blue-200/70">
              Total subscribers
            </p>
          )}
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-white">
            Staff
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400/30 to-indigo-600/30 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <UsersRound className="h-4 w-4 text-indigo-400" />
          </div>
        </CardHeader>
        <CardContent className="p-3 md:p-4 pt-2">
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{formatNumber(data.staffCount)}</div>
          {data.staffChangeText ? (
            <p className="text-xs text-blue-200/70">
              {data.staffChangeText}
            </p>
          ) : (
            <p className="text-xs text-blue-200/70">
              Active staff members
            </p>
          )}
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-white">
            Task Completion Rate
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400/30 to-teal-600/30 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.3)]">
            <TrendingUp className="h-4 w-4 text-teal-400" />
          </div>
        </CardHeader>
        <CardContent className="p-3 md:p-4 pt-2">
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
            {data.taskCompletionRate !== null ? `${data.taskCompletionRate}%` : "—"}
          </div>
          {data.completionRateChangeText ? (
            <p className="text-xs text-blue-200/70">
              {data.completionRateChangeText}
            </p>
          ) : (
            <p className="text-xs text-blue-200/70">
              No tasks found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
