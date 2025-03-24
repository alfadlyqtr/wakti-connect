
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkLogsData } from "./hooks/useWorkLogsData";
import WorkLogFilters from "./components/WorkLogFilters";
import WorkLogsTable from "./components/WorkLogsTable";
import WorkLogsSummary from "./components/WorkLogsSummary";
import { EmptyState, LoadingState } from "./components/WorkLogStates";

interface WorkLogsTabProps {
  selectedStaffId: string | null;
}

const WorkLogsTab: React.FC<WorkLogsTabProps> = ({ selectedStaffId }) => {
  const {
    selectedStaff,
    setSelectedStaff,
    timeRange,
    setTimeRange,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    staffMembers,
    staffLoading,
    workLogs,
    logsLoading
  } = useWorkLogsData(selectedStaffId);

  if (staffLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      <WorkLogFilters
        staffMembers={staffMembers}
        selectedStaff={selectedStaff}
        onStaffChange={setSelectedStaff}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        customStartDate={customStartDate}
        onStartDateChange={setCustomStartDate}
        customEndDate={customEndDate}
        onEndDateChange={setCustomEndDate}
      />

      {!selectedStaff ? (
        <EmptyState 
          message="Select a Staff Member" 
          subMessage="Select a staff member to view their work logs" 
        />
      ) : logsLoading ? (
        <LoadingState />
      ) : !workLogs || workLogs.length === 0 ? (
        <EmptyState 
          message="No Work Logs" 
          subMessage="No work logs found for the selected period" 
        />
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Work Logs</CardTitle>
            <CardDescription>
              Showing {workLogs.length} work {workLogs.length === 1 ? 'session' : 'sessions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WorkLogsTable workLogs={workLogs} />
          </CardContent>
          <WorkLogsSummary workLogs={workLogs} />
        </Card>
      )}
    </div>
  );
};

export default WorkLogsTab;
