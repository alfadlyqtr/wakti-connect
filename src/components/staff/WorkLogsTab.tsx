
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { formatDuration } from "@/utils/formatDuration";
import { useStaffWorkLogs } from "@/hooks/useStaffWorkLogs";
import { StaffWorkSessionTable } from "./StaffWorkSessionTable";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const WorkLogsTabHeader = () => (
  <div className="flex items-center justify-between">
    <h2 className="text-xl font-semibold">Work Logs</h2>
  </div>
);

const StaffSpecificTab = ({ staffId, staffName, sessions }) => (
  <TabsContent key={staffId} value={staffId} className="border-none p-0">
    <Card>
      <CardContent className="p-4">
        <ErrorBoundary fallback={
          <div className="p-4 border rounded-lg border-destructive/50 bg-destructive/10 text-center">
            <p>Error loading work logs for {staffName}. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 rounded-md bg-primary text-primary-foreground"
            >
              Refresh
            </button>
          </div>
        }>
          {sessions.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              No work logs for {staffName}
            </p>
          ) : (
            <StaffWorkLogsTable sessions={sessions} />
          )}
        </ErrorBoundary>
      </CardContent>
    </Card>
  </TabsContent>
);

const StaffWorkLogsTable = ({ sessions }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Start Time</TableHead>
        <TableHead>End Time</TableHead>
        <TableHead>Duration</TableHead>
        <TableHead>Earnings</TableHead>
        <TableHead>Notes</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {sessions.map((session) => (
        <TableRow key={session.id}>
          <TableCell>{format(new Date(session.start_time), "PPpp")}</TableCell>
          <TableCell>
            {session.end_time ? format(new Date(session.end_time), "PPpp") : "In progress"}
          </TableCell>
          <TableCell>
            {formatDuration(session.start_time, session.end_time)}
          </TableCell>
          <TableCell>{session.earnings || "N/A"}</TableCell>
          <TableCell>{session.notes || "N/A"}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const AllStaffWorkLogsTable = ({ staffWithSessions }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Staff</TableHead>
        <TableHead>Start Time</TableHead>
        <TableHead>End Time</TableHead>
        <TableHead>Duration</TableHead>
        <TableHead>Earnings</TableHead>
        <TableHead>Notes</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {staffWithSessions?.map((staff) => (
        staff.sessions?.map((session) => (
          <TableRow key={session.id}>
            <TableCell>{staff.name}</TableCell>
            <TableCell>{format(new Date(session.start_time), "PPpp")}</TableCell>
            <TableCell>
              {session.end_time ? format(new Date(session.end_time), "PPpp") : "In progress"}
            </TableCell>
            <TableCell>
              {formatDuration(session.start_time, session.end_time)}
            </TableCell>
            <TableCell>{session.earnings || "N/A"}</TableCell>
            <TableCell>{session.notes || "N/A"}</TableCell>
          </TableRow>
        ))
      ))}
    </TableBody>
  </Table>
);

const LoadingState = () => (
  <p className="text-center py-4">Loading work logs...</p>
);

const ErrorState = ({ error }) => (
  <div className="p-6 border rounded-lg border-destructive/50 bg-destructive/10 text-center">
    <h3 className="text-lg font-semibold mb-2">Unable to load work logs</h3>
    <p className="text-muted-foreground mb-4">
      {error?.message || "An unexpected error occurred. Please try again later."}
    </p>
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
    >
      Refresh Page
    </button>
  </div>
);

const WorkLogsTab = () => {
  const { data: staffWithSessions, isLoading, error } = useStaffWorkLogs();
  
  return (
    <ErrorBoundary fallback={
      <div className="p-6 border rounded-lg border-destructive/50 bg-destructive/10 text-center">
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground mb-4">
          We encountered an error loading work logs. Please try refreshing the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
        >
          Refresh Page
        </button>
      </div>
    }>
      <div className="space-y-6">
        <WorkLogsTabHeader />
        
        {error ? <ErrorState error={error} /> : (
          <Tabs defaultValue="all-staff" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all-staff">All Staff</TabsTrigger>
              {staffWithSessions?.map((staff) => (
                <TabsTrigger key={staff.id} value={staff.id}>
                  {staff.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all-staff" className="border-none p-0">
              <Card>
                <CardContent className="p-4">
                  <ErrorBoundary fallback={
                    <div className="p-4 border rounded-lg border-destructive/50 bg-destructive/10 text-center">
                      <p>Error loading combined staff logs. Please try refreshing the page.</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-4 py-2 rounded-md bg-primary text-primary-foreground"
                      >
                        Refresh
                      </button>
                    </div>
                  }>
                    {isLoading ? <LoadingState /> : (
                      <AllStaffWorkLogsTable staffWithSessions={staffWithSessions} />
                    )}
                  </ErrorBoundary>
                </CardContent>
              </Card>
            </TabsContent>
            
            {staffWithSessions?.map((staff) => (
              <StaffSpecificTab 
                key={staff.id}
                staffId={staff.id}
                staffName={staff.name}
                sessions={staff.sessions}
              />
            ))}
          </Tabs>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default WorkLogsTab;
