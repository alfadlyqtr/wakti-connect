
import React from "react";
import { useStaffWorkLogs } from "@/hooks/useStaffWorkLogs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText } from "lucide-react";

const DashboardWorkLogs = () => {
  const { data: staffData, isLoading, error } = useStaffWorkLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Staff Work Logs</h1>
        <p className="text-muted-foreground">Track staff hours, sessions, and earnings</p>
      </div>
      
      {isLoading ? (
        <Card className="p-6 text-center">
          <div className="h-6 w-6 border-4 border-t-transparent border-primary rounded-full animate-spin mx-auto"></div>
          <p className="mt-2">Loading work logs...</p>
        </Card>
      ) : error ? (
        <Card className="p-6">
          <p className="text-destructive">Error loading work logs: {error.message}</p>
          <Button className="mt-2" variant="secondary">Retry</Button>
        </Card>
      ) : !staffData || staffData.length === 0 ? (
        <Card className="p-6 text-center">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Work Logs Available</h3>
          <p className="text-muted-foreground">There are no staff work logs to display.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {staffData.map(staff => (
            <Card key={staff.id} className="p-4">
              <h3 className="font-medium text-lg mb-2">{staff.name}</h3>
              <div className="border-t pt-3 mt-3">
                {staff.sessions && staff.sessions.length > 0 ? (
                  <div className="grid gap-3">
                    {staff.sessions.map(session => (
                      <div key={session.id} className="flex justify-between items-center border-b pb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(session.start_time).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {new Date(session.start_time).toLocaleTimeString()} - 
                            {session.end_time ? new Date(session.end_time).toLocaleTimeString() : 'Ongoing'}
                          </span>
                        </div>
                        {session.earnings > 0 && (
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>${session.earnings}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No work sessions recorded</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardWorkLogs;
