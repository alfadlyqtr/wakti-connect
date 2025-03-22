
import React, { useState, lazy, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card } from '@/components/ui/card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { JobsTab } from '@/components/jobs/JobsTab';
import { JobCardsTab } from '@/components/jobs/JobCardsTab';

export default function DashboardWorkManagement() {
  const [activeTab, setActiveTab] = useState("jobs");
  
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Work Management"
        description="Manage jobs and work cards for your team"
      />
      
      <Tabs defaultValue="jobs" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="job-cards">Job Cards</TabsTrigger>
        </TabsList>
        
        <Suspense fallback={<LoadingSpinner />}>
          <TabsContent value="jobs" className="m-0">
            <JobsTab />
          </TabsContent>
          <TabsContent value="job-cards" className="m-0">
            <JobCardsTab />
          </TabsContent>
        </Suspense>
      </Tabs>
    </DashboardShell>
  );
}
