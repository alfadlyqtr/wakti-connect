
import React, { useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateJobDialog } from "@/components/jobs/CreateJobDialog";

const DashboardJobs = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <DashboardShell>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Jobs Management</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Job
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Job list would go here */}
        <div className="border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">No jobs created yet</p>
        </div>
      </div>

      <CreateJobDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </DashboardShell>
  );
};

export default DashboardJobs;
