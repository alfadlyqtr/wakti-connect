
import React, { Suspense, lazy } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Loader2 } from "lucide-react";

// Update to properly import components with named exports
const JobsTab = lazy(() => import("@/components/jobs/JobsTab").then(module => ({ default: module.JobsTab })));
const JobCardsTab = lazy(() => import("@/components/jobs/JobCardsTab").then(module => ({ default: module.JobCardsTab })));

const DashboardWorkManagement: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("jobs");

  return (
    <DashboardShell>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Work Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="jobs">Jobs & Services</TabsTrigger>
          <TabsTrigger value="job-cards">Job Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <Suspense fallback={
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          }>
            <JobsTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="job-cards" className="space-y-4">
          <Suspense fallback={
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          }>
            <JobCardsTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
};

export default DashboardWorkManagement;
