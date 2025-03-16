
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, FileText } from "lucide-react";

const AnalyticsTab = React.lazy(() => import("@/components/analytics/AnalyticsTab"));
const ReportsTab = React.lazy(() => import("@/components/analytics/ReportsTab"));

const DashboardAnalyticsHub = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics Hub</h1>
        <p className="text-muted-foreground">View insights, analyze performance, and generate reports</p>
      </div>
      
      <Tabs defaultValue="analytics">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="mt-0">
          <React.Suspense fallback={<div>Loading...</div>}>
            <AnalyticsTab />
          </React.Suspense>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-0">
          <React.Suspense fallback={<div>Loading...</div>}>
            <ReportsTab />
          </React.Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardAnalyticsHub;
