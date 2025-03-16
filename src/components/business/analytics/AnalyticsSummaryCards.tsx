
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { UsersRound, Calendar, TrendingUp } from "lucide-react";

interface AnalyticsData {
  subscriberCount: number;
  appointmentCount: number;
  staffCount: number;
  taskCompletionRate: number;
  timeRange: "week" | "month" | "year";
}

export const AnalyticsSummaryCards = ({ data }: { data: AnalyticsData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Subscribers
          </CardTitle>
          <UsersRound className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.subscriberCount}</div>
          <p className="text-xs text-muted-foreground">
            +12% from last {data.timeRange}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Completed Appointments
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.appointmentCount}</div>
          <p className="text-xs text-muted-foreground">
            +8% from last {data.timeRange}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Staff
          </CardTitle>
          <UsersRound className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.staffCount}</div>
          <p className="text-xs text-muted-foreground">
            +1 from last {data.timeRange}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Task Completion Rate
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.taskCompletionRate}%</div>
          <p className="text-xs text-muted-foreground">
            +5% from last {data.timeRange}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
