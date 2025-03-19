
import React from "react";
import { useStaffWorkLogs } from "@/hooks/useStaffWorkLogs";
import { Card } from "@/components/ui/card";

const WorkLogsTab = () => {
  const { data: staffWithSessions, isLoading, error } = useStaffWorkLogs();

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin mx-auto"></div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8">
        <p className="text-center text-destructive">Error loading work logs</p>
      </Card>
    );
  }

  if (!staffWithSessions || staffWithSessions.length === 0) {
    return (
      <Card className="p-8">
        <p className="text-center text-muted-foreground">No work logs found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Staff Work Sessions</h2>
      
      {staffWithSessions.map((staffMember) => (
        <Card key={staffMember.id} className="p-4">
          <h3 className="font-medium text-lg">{staffMember.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{staffMember.email || "No email provided"}</p>
          
          {staffMember.sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No work sessions recorded</p>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-4 text-sm font-medium">
                <span>Date</span>
                <span>Start Time</span>
                <span>End Time</span>
                <span>Earnings</span>
              </div>
              {staffMember.sessions.map((session) => (
                <div key={session.id} className="grid grid-cols-4 text-sm border-t pt-2">
                  <span>{new Date(session.start_time).toLocaleDateString()}</span>
                  <span>{new Date(session.start_time).toLocaleTimeString()}</span>
                  <span>{session.end_time ? new Date(session.end_time).toLocaleTimeString() : "In progress"}</span>
                  <span>{session.earnings ? `$${session.earnings.toFixed(2)}` : "-"}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default WorkLogsTab;
