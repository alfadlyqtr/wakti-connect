
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Users, Calendar, Clock } from "lucide-react";
import { StatsCard } from "@/components/business/StatsCard";
import { SubscriberGrowthChart } from "@/components/business/charts/SubscriberGrowthChart";
import { BookingActivityChart } from "@/components/business/charts/BookingActivityChart";
import { ServicePopularityChart } from "@/components/business/charts/ServicePopularityChart";
import { RevenueOverview } from "@/components/business/RevenueOverview";
import { useBusinessReports } from "@/hooks/useBusinessReports";

const DashboardBusinessReports = () => {
  const {
    subscriberCount,
    subscribersLoading,
    staffCount,
    staffLoading,
    serviceCount,
    servicesLoading
  } = useBusinessReports();

  const handleDownloadReport = () => {
    // This would generate a report file in a real application
    console.log("Downloading report...");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Business Reports</h1>
          <p className="text-muted-foreground">Track your business performance and analyze key metrics.</p>
        </div>
        <Button className="md:self-start" onClick={handleDownloadReport}>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Subscribers"
          value={subscribersLoading ? (
            <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
          ) : (
            subscriberCount
          )}
          icon={Users}
          subtitle="+12% from last month"
        />

        <StatsCard
          title="Bookings"
          value={78}
          icon={Calendar}
          subtitle="This month"
        />

        <StatsCard
          title="Staff"
          value={staffLoading ? (
            <div className="h-6 w-12 bg-muted animate-pulse rounded"></div>
          ) : (
            staffCount
          )}
          icon={Clock}
          subtitle="Active staff members"
        />
      </div>

      <Tabs defaultValue="growth">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="growth" className="mt-6">
          <SubscriberGrowthChart />
        </TabsContent>
        
        <TabsContent value="engagement" className="mt-6">
          <BookingActivityChart />
        </TabsContent>
        
        <TabsContent value="services" className="mt-6">
          <ServicePopularityChart />
        </TabsContent>
      </Tabs>

      <RevenueOverview 
        serviceCount={serviceCount}
        servicesLoading={servicesLoading}
        onDownload={handleDownloadReport}
      />
    </div>
  );
};

export default DashboardBusinessReports;
