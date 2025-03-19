
import React from "react";
import { useStaffWorkLogs } from "@/hooks/useStaffWorkLogs";
import WorkLogsTab from "@/components/staff/WorkLogsTab";

const DashboardWorkLogs = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Staff Work Logs</h1>
        <p className="text-muted-foreground">Track staff hours, sessions, and earnings</p>
      </div>
      
      <WorkLogsTab />
    </div>
  );
};

export default DashboardWorkLogs;
