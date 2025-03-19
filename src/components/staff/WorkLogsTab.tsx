
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { formatDuration } from "@/utils/formatDuration";
import { useStaffWorkLogs } from "@/hooks/useStaffWorkLogs";
import { StaffWorkSessionTable } from "./StaffWorkSessionTable";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { CalendarRange, FilterX } from "lucide-react";

const WorkLogsTabHeader = ({ startDate, endDate, setStartDate, setEndDate, resetFilters }) => (
  <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
    <h2 className="text-xl font-semibold">Work Logs</h2>
    
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center gap-3">
        <DatePicker 
          date={startDate} 
          setDate={setStartDate} 
          className="w-full sm:w-[160px]" 
          placeholder="Start date"
        />
        <span className="hidden sm:inline">to</span>
        <DatePicker 
          date={endDate} 
          setDate={setEndDate} 
          className="w-full sm:w-[160px]" 
          placeholder="End date" 
        />
      </div>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={resetFilters}
        title="Clear filters"
      >
        <FilterX className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

const StaffSpecificTab = ({ staffId, staffName, sessions, startDate, endDate }) => {
  // Filter sessions by date range if dates are specified
  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.start_time);
    
    const isAfterStartDate = !startDate || sessionDate >= startDate;
    const isBeforeEndDate = !endDate || sessionDate <= new Date(endDate.setHours(23, 59, 59, 999));
    
    return isAfterStartDate && isBeforeEndDate;
  });
  
  return (
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
            {filteredSessions.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                No work logs for {staffName}{startDate || endDate ? " in the selected date range" : ""}
              </p>
            ) : (
              <StaffWorkLogsTable sessions={filteredSessions} />
            )}
          </ErrorBoundary>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

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

const AllStaffWorkLogsTable = ({ staffWithSessions, startDate, endDate }) => {
  // Filter all sessions by date range
  const filteredStaffWithSessions = staffWithSessions.map(staff => {
    const filteredSessions = staff.sessions.filter(session => {
      const sessionDate = new Date(session.start_time);
      
      const isAfterStartDate = !startDate || sessionDate >= startDate;
      const isBeforeEndDate = !endDate || sessionDate <= new Date(endDate ? new Date(endDate).setHours(23, 59, 59, 999) : Date.now());
      
      return isAfterStartDate && isBeforeEndDate;
    });
    
    return { ...staff, sessions: filteredSessions };
  });
  
  // Only include staff with sessions after filtering
  const staffWithFilteredSessions = filteredStaffWithSessions.filter(staff => staff.sessions.length > 0);
  
  if (staffWithFilteredSessions.length === 0) {
    return (
      <p className="text-center py-4 text-muted-foreground">
        No work logs found{startDate || endDate ? " in the selected date range" : ""}
      </p>
    );
  }
  
  return (
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
        {staffWithFilteredSessions.map((staff) => (
          staff.sessions.map((session) => (
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
};

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

const DateRangeIndicator = ({ startDate, endDate }) => {
  if (!startDate && !endDate) return null;
  
  return (
    <div className="flex items-center gap-2 mt-2 mb-4 text-sm text-muted-foreground">
      <CalendarRange className="h-4 w-4" />
      <span>
        {startDate ? format(startDate, "PPP") : "Any date"} - {endDate ? format(endDate, "PPP") : "Any date"}
      </span>
    </div>
  );
};

const WorkLogsTab = () => {
  const { data: staffWithSessions, isLoading, error } = useStaffWorkLogs();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  const resetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };
  
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
      <div className="space-y-4">
        <WorkLogsTabHeader 
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          resetFilters={resetFilters}
        />
        
        <DateRangeIndicator startDate={startDate} endDate={endDate} />
        
        {error ? <ErrorState error={error} /> : (
          <Tabs defaultValue="all-staff" className="space-y-4">
            <TabsList className="mb-2">
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
                      <AllStaffWorkLogsTable 
                        staffWithSessions={staffWithSessions}
                        startDate={startDate}
                        endDate={endDate} 
                      />
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
                startDate={startDate}
                endDate={endDate}
              />
            ))}
          </Tabs>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default WorkLogsTab;
