
import React from "react";
import { useStaffWorkLogs } from "@/hooks/useStaffWorkLogs";
import { StaffList } from "@/components/staff/StaffList";

const WorkLogsTab = () => {
  const { data: staffData, isLoading } = useStaffWorkLogs();

  return (
    <>
      <StaffList staffData={staffData} isLoading={isLoading} />
    </>
  );
};

export default WorkLogsTab;
