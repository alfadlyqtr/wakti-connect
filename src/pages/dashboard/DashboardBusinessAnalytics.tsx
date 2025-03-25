
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
import { syncServiceDistribution, ensureAnalyticsData } from "@/utils/analyticsSync";

const DashboardBusinessAnalytics = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<string>("overview");
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSyncing, setIsSyncing] = useState(true);
  const { isLoading, error, data } = useBusinessAnalytics("month");
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Verify that the user has a business account and sync analytics data
  useEffect(() => {
    const initialize = async () => {
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
        
        // Now sync analytics data with real service names
        setIsSyncing(true);
        
        // Initialize analytics data if needed
        await ensureAnalyticsData();
        
        // Sync service distribution with real service names
        await syncServiceDistribution();
        
      } catch (error) {
        console.error("Error verifying account or syncing data:", error);
        toast({
          title: "Initialization Error",
          description: "Could not prepare analytics data. Please try refreshing.",
          variant: "destructive"
        });
      } finally {
        setIsVerifying(false);
        setIsSyncing(false);
      }
    };
    
    initialize();
  }, [navigate]);

  if (isVerifying || isSyncing) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p>{isVerifying ? "Verifying account access..." : "Syncing analytics data..."}</p>
      </div>
    );
  }

  // If there's no data but we've verified the account is business type,
  // show a loading state rather than an error
  if (!data && !error && !isLoading) {
    return (
      <div className="container py-6 space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("dashboard.analytics")}
        </h1>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">
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
        <TabsList className={`grid w-full ${isMobile ? "grid-cols-1 gap-2" : "max-w-md grid-cols-3"}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <AnalyticsSummaryCards 
            isLoading={isLoading} 
            data={data || { 
              subscriberCount: 0, 
              staffCount: 0, 
              taskCompletionRate: 0, 
              timeRange: "month",
              growth: [],
              serviceDistribution: []
            }} 
          />

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="w-full">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Growth Trends</h3>
                <GrowthChart 
                  isLoading={isLoading} 
                  data={data?.growth || []} 
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6 mt-6">
          <SectionContainer>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="w-full">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Service Distribution</h3>
                  <ServiceDistributionChart 
                    isLoading={isLoading} 
                    data={data?.serviceDistribution || []} 
                  />
                </CardContent>
              </Card>
            </div>
          </SectionContainer>
        </TabsContent>
        
        <TabsContent value="staff" className="space-y-6 mt-6">
          <SectionContainer>
            <div className="grid gap-6 md:grid-cols-1">
              <Card className="w-full">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Staff Activity</h3>
                  <div className="h-[400px]">
                    <TeamActivityChart />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="w-full">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Staff Performance Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm text-muted-foreground mb-1">Average Hours</p>
                      <h4 className="text-2xl font-bold">32.5</h4>
                      <p className="text-xs text-muted-foreground">hrs/week</p>
                    </div>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm text-muted-foreground mb-1">Task Completion</p>
                      <h4 className="text-2xl font-bold">87%</h4>
                      <p className="text-xs text-muted-foreground">on time</p>
                    </div>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm text-muted-foreground mb-1">Avg. Services</p>
                      <h4 className="text-2xl font-bold">5.2</h4>
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
