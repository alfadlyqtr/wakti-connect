
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { SectionContainer } from "@/components/ui/section-container";
import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";
import AnalyticsSummaryCards from "@/components/business/analytics/AnalyticsSummaryCards";
import ServiceDistributionChart from "@/components/business/analytics/ServiceDistributionChart";
import GrowthChart from "@/components/business/analytics/GrowthChart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useBusinessAnalytics } from "@/hooks/useBusinessAnalytics";

const DashboardBusinessAnalytics = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<string>("overview");
  const { isLoading, error, analytics } = useBusinessAnalytics();

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
            analytics={analytics} 
          />

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Growth Trends</h3>
                <GrowthChart 
                  isLoading={isLoading} 
                  data={analytics?.growth || []} 
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
                    data={analytics?.serviceDistribution || []} 
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
