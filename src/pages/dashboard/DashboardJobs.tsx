
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { JobsTab } from "@/components/jobs/JobsTab";

const DashboardJobs = () => {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Job Management</h1>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs" className="space-y-4">
          <JobsTab />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
};

export default DashboardJobs;
