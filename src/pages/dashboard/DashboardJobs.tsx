
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CreateJobDialog } from '@/components/jobs/CreateJobDialog';
import { JobsTab } from '@/components/jobs/JobsTab';

export default function DashboardJobs() {
  const [openCreateJob, setOpenCreateJob] = useState(false);
  
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Jobs Management"
        description="Manage your jobs and assign them to staff members"
      >
        <Button onClick={() => setOpenCreateJob(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Job
        </Button>
      </DashboardHeader>
      
      <JobsTab />
      
      <CreateJobDialog 
        open={openCreateJob}
        onOpenChange={setOpenCreateJob}
      />
    </DashboardShell>
  );
}
