
import React from "react";
import { useStaffWorkLogs } from "@/hooks/useStaffWorkLogs";
import StaffList from "@/components/staff/StaffList";

const DashboardWorkLogs = () => {
  const { data: staffData, isLoading } = useStaffWorkLogs();

  // Create empty handler functions for required props
  const handleCreateStaff = () => {
    console.log("Create staff functionality not implemented in work logs view");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Staff Work Logs</h1>
        <p className="text-muted-foreground">Track staff hours, sessions, and earnings</p>
      </div>
      
      <StaffList 
        staffMembers={staffData} 
        isLoading={isLoading} 
        hasError={false}
        onCreateStaff={handleCreateStaff}
        onEditStaff={() => {}}
        onSuspendStaff={() => {}}
        onDeleteStaff={() => {}}
        onReactivateStaff={() => {}}
      />
    </div>
  );
};

export default DashboardWorkLogs;
