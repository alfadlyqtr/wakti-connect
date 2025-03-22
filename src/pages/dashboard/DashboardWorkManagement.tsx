
import React from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";

const DashboardWorkManagement = () => {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Work Management</h1>
      </div>

      <div className="grid gap-6">
        <p className="text-muted-foreground">
          Work management functionality has been removed from this version.
        </p>
      </div>
    </DashboardShell>
  );
};

export default DashboardWorkManagement;
