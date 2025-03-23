
import React from "react";
import { useStaffWorkLogs } from "@/hooks/useStaffWorkLogs";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const WorkLogsTab = () => {
  const { data: staffWithLogs, isLoading, error } = useStaffWorkLogs();

  if (isLoading) {
    return <div className="text-center p-8">Loading work logs...</div>;
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center text-destructive space-x-2">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">Failed to load work logs</p>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </p>
      </Card>
    );
  }

  if (!staffWithLogs || staffWithLogs.length === 0) {
    return (
      <Card className="text-center p-8">
        <p className="text-muted-foreground">No work logs found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {staffWithLogs.map(staff => (
        <Card key={staff.id} className="p-4">
          <h3 className="font-medium text-lg mb-2">{staff.name}</h3>
          {staff.sessions && staff.sessions.length > 0 ? (
            <div className="space-y-2">
              {staff.sessions.map(session => (
                <div key={session.id} className="border rounded p-3">
                  <div className="flex justify-between">
                    <span>Start: {new Date(session.start_time).toLocaleString()}</span>
                    <span>Status: {session.status}</span>
                  </div>
                  {session.end_time && (
                    <div>End: {new Date(session.end_time).toLocaleString()}</div>
                  )}
                  {session.earnings > 0 && (
                    <div>Earnings: ${session.earnings}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No work sessions recorded</p>
          )}
        </Card>
      ))}
    </div>
  );
};

export default WorkLogsTab;
