
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { SectionContainer } from "@/components/ui/section-container";
import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useBusinessAnalytics } from "@/hooks/useBusinessAnalytics";
import { AnalyticsSummaryCards } from "@/components/business/analytics/AnalyticsSummaryCards";
import { ServiceDistributionChart } from "@/components/business/analytics/ServiceDistributionChart";
import { GrowthChart } from "@/components/business/analytics/GrowthChart";
import { accountTypeVerification } from "@/utils/accountTypeVerification";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const DashboardBusinessAnalytics = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<string>("overview");
  const { isLoading, error, data } = useBusinessAnalytics("month");
  const navigate = useNavigate();

  // Verify that the user has a business account when accessing this page
  useEffect(() => {
    const verifyBusinessAccount = async () => {
      const isBusinessAccount = await accountTypeVerification.verifyAccountType('business');
      
      if (!isBusinessAccount) {
        toast({
          title: "Access Denied",
          description: "You need a business account to access analytics.",
          variant: "destructive"
        });
        navigate("/dashboard");
      }
    };
    
    verifyBusinessAccount();
  }, [navigate]);

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
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
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
            <Card>
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
              <Card>
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
      </Tabs>
    </div>
  );
};

export default DashboardBusinessAnalytics;
