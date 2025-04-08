
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { SectionContainer } from "@/components/ui/section-container";
import { useTranslation } from "react-i18next";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useBusinessAnalytics } from "@/hooks/useBusinessAnalytics";
import { AnalyticsSummaryCards } from "@/components/business/analytics/AnalyticsSummaryCards";
import { ServiceDistributionChart } from "@/components/business/analytics/ServiceDistributionChart";
import { GrowthChart } from "@/components/business/analytics/GrowthChart";
import { accountTypeVerification } from "@/utils/accountTypeVerification";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { TeamActivityChart } from "@/components/analytics/TeamActivityChart";

const DashboardBusinessAnalytics = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<string>("overview");
  const [isVerifying, setIsVerifying] = useState(true);
  const { isLoading, error, data } = useBusinessAnalytics("month");
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Verify that the user has a business account when accessing this page
  useEffect(() => {
    const verifyBusinessAccount = async () => {
      try {
        setIsVerifying(true);
        const isBusinessAccount = await accountTypeVerification.verifyAccountType('business');
        
        if (!isBusinessAccount) {
          toast({
            title: "Access Denied",
            description: "You need a business account to access analytics.",
            variant: "destructive"
          });
          navigate("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Error verifying account type:", error);
        toast({
          title: "Verification Error",
          description: "Could not verify your account type. Please try again.",
          variant: "destructive"
        });
        navigate("/dashboard");
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyBusinessAccount();
  }, [navigate]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p>Verifying account access...</p>
      </div>
    );
  }

  // Default analytics data
  const defaultAnalyticsData = {
    subscriberCount: 0,
    staffCount: 0,
    taskCompletionRate: 0,
    timeRange: "month" as const,
    growth: [],
    serviceDistribution: []
  };

  return (
    <div className="container py-4 md:py-6 space-y-4 md:space-y-8">
      <h1 className="text-xl md:text-3xl font-bold tracking-tight">
        {t("dashboard.analytics")}
      </h1>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load analytics"}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" value={tab} onValueChange={setTab}>
        <TabsList className="w-full grid grid-cols-3 h-auto">
          <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="services" className="text-xs md:text-sm">Services</TabsTrigger>
          <TabsTrigger value="staff" className="text-xs md:text-sm">Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
          <AnalyticsSummaryCards 
            isLoading={isLoading} 
            data={data || defaultAnalyticsData} 
          />

          <div className="grid gap-4 md:gap-6 md:grid-cols-2">
            <Card className="w-full">
              <CardContent className="pt-4 md:pt-6">
                <h3 className="text-base md:text-lg font-medium mb-2 md:mb-4">Growth Trends</h3>
                <GrowthChart 
                  isLoading={isLoading} 
                  data={data?.growth || []} 
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
          <SectionContainer noPadding>
            <div className="grid gap-4 md:gap-6 md:grid-cols-2">
              <Card className="w-full">
                <CardContent className="pt-4 md:pt-6">
                  <h3 className="text-base md:text-lg font-medium mb-2 md:mb-4">Service Distribution</h3>
                  <ServiceDistributionChart 
                    isLoading={isLoading} 
                    data={data?.serviceDistribution || []} 
                    labels={data?.serviceLabels}
                  />
                </CardContent>
              </Card>
            </div>
          </SectionContainer>
        </TabsContent>
        
        <TabsContent value="staff" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
          <SectionContainer noPadding>
            <div className="grid gap-4 md:gap-6 md:grid-cols-1">
              <Card className="w-full">
                <CardContent className="pt-4 md:pt-6">
                  <h3 className="text-base md:text-lg font-medium mb-2 md:mb-4">Staff Activity</h3>
                  <div className={`h-[350px] md:h-[400px] ${isMobile ? 'px-0' : 'px-4'}`}>
                    <TeamActivityChart />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="w-full">
                <CardContent className="pt-4 md:pt-6">
                  <h3 className="text-base md:text-lg font-medium mb-2 md:mb-4">Staff Performance Metrics</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">Average Hours</p>
                      <h4 className="text-xl md:text-2xl font-bold">-</h4>
                      <p className="text-xs text-muted-foreground">hrs/week</p>
                    </div>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">Task Completion</p>
                      <h4 className="text-xl md:text-2xl font-bold">-</h4>
                      <p className="text-xs text-muted-foreground">on time</p>
                    </div>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">Avg. Services</p>
                      <h4 className="text-xl md:text-2xl font-bold">-</h4>
                      <p className="text-xs text-muted-foreground">per day</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SectionContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardBusinessAnalytics;
