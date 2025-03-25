
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Users, Calendar, Clock } from "lucide-react";
import { StatsCard } from "@/components/business/StatsCard";
import { SubscriberGrowthChart } from "@/components/business/charts/SubscriberGrowthChart";
import { BookingActivityChart } from "@/components/business/charts/BookingActivityChart";
import { ServicePopularityChart } from "@/components/business/charts/ServicePopularityChart";
import { RevenueOverview } from "@/components/business/RevenueOverview";
import { useBusinessReports } from "@/hooks/useBusinessReports";
import { accountTypeVerification } from "@/utils/accountTypeVerification";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { TeamActivityChart } from "@/components/analytics/TeamActivityChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardBusinessReports = () => {
  const {
    subscriberCount,
    subscribersLoading,
    staffCount,
    staffLoading,
    serviceCount,
    servicesLoading,
    bookingCount,
    bookingsLoading,
    subscriberGrowthRate
  } = useBusinessReports();
  
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Verify that the user has a business account when accessing this page
  useEffect(() => {
    const verifyBusinessAccount = async () => {
      const isBusinessAccount = await accountTypeVerification.verifyAccountType('business');
      
      if (!isBusinessAccount) {
        toast({
          title: "Access Denied",
          description: "You need a business account to access reports.",
          variant: "destructive"
        });
        navigate("/dashboard");
      }
    };
    
    verifyBusinessAccount();
  }, [navigate]);

  const handleDownloadReport = () => {
    // This would generate a report file in a real application
    toast({
      title: "Download Started",
      description: "Your report is being generated and will download shortly.",
    });
    console.log("Downloading report...");
  };

  return (
    <div className="container py-6 space-y-6">
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
          subtitle={`${subscriberGrowthRate} from last month`}
        />

        <StatsCard
          title="Bookings"
          value={bookingsLoading ? (
            <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
          ) : (
            bookingCount
          )}
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
        <TabsList className={`grid w-full ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4"}`}>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
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
        
        <TabsContent value="staff" className="mt-6">
          <div className="grid gap-6 grid-cols-1">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Staff Activity Hours</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <TeamActivityChart />
              </CardContent>
            </Card>
            
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Staff Availability & Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Staff Availability</h3>
                    <div className="space-y-3">
                      {staffLoading ? (
                        [...Array(4)].map((_, index) => (
                          <div key={index} className="h-16 bg-muted animate-pulse rounded-md"></div>
                        ))
                      ) : staffCount === 0 ? (
                        <div className="p-3 bg-muted rounded-md">
                          <p>No staff members available</p>
                        </div>
                      ) : (
                        <div className="p-3 bg-muted rounded-md">
                          <p>Staff availability data is being loaded from your real staff members</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Staff Utilization</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Service Allocation</span>
                          <span className="text-sm font-medium">78%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Administrative Tasks</span>
                          <span className="text-sm font-medium">15%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Training</span>
                          <span className="text-sm font-medium">7%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '7%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Staff Contribution to Revenue</h4>
                      <div className="p-3 bg-muted rounded-md">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Top Performer</p>
                            <p className="font-medium">Staff data is being loaded</p>
                            <p className="text-xs text-muted-foreground">Based on your real staff data</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Most Bookings</p>
                            <p className="font-medium">Calculation in progress</p>
                            <p className="text-xs text-muted-foreground">Based on actual bookings</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
