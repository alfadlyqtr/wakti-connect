
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { AnalyticsSummaryCards } from "@/components/business/analytics/AnalyticsSummaryCards";
import { AppointmentCharts } from "@/components/business/analytics/AppointmentCharts";
import { GrowthChart } from "@/components/business/analytics/GrowthChart";
import { ServiceDistributionChart } from "@/components/business/analytics/ServiceDistributionChart";
import { useBusinessAnalytics } from "@/hooks/useBusinessAnalytics";

const DashboardBusinessAnalytics = () => {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
  const { data: analyticsData, isLoading, error } = useBusinessAnalytics(timeRange);

  if (error) {
    toast({
      variant: "destructive",
      title: "Error loading analytics data",
      description: "Please try again later or contact support if the problem persists."
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold mb-2">Business Analytics</h1>
        <p className="text-muted-foreground">Track your business growth and performance metrics.</p>
      </div>
      
      <div className="flex justify-end">
        <Tabs defaultValue={timeRange} className="w-[300px]" onValueChange={(value) => setTimeRange(value as "week" | "month" | "year")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">
          <p>Error loading analytics data</p>
        </div>
      ) : analyticsData ? (
        <>
          <AnalyticsSummaryCards data={analyticsData} />

          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
              <TabsTrigger value="appointments" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Appointments</span>
              </TabsTrigger>
              <TabsTrigger value="growth" className="flex items-center gap-2">
                <LineChartIcon className="h-4 w-4" />
                <span>Growth Trends</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <PieChartIcon className="h-4 w-4" />
                <span>Services</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointments" className="space-y-4">
              <AppointmentCharts />
            </TabsContent>
            
            <TabsContent value="growth" className="space-y-4">
              <GrowthChart />
            </TabsContent>
            
            <TabsContent value="services" className="space-y-4">
              <ServiceDistributionChart />
            </TabsContent>
          </Tabs>
        </>
      ) : null}
    </div>
  );
};

export default DashboardBusinessAnalytics;
