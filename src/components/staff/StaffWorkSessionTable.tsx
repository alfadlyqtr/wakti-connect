
import React from "react";
import { WorkSession } from "@/hooks/useStaffData";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/utils/dateUtils";

interface StaffWorkSessionTableProps {
  sessions: WorkSession[];
}

const StaffWorkSessionTable: React.FC<StaffWorkSessionTableProps> = ({ sessions }) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No work sessions found</p>
      </div>
    );
  }
  
  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc, session) => {
    const date = new Date(session.start_time).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as Record<string, WorkSession[]>);
  
  // Sort dates newest first
  const sortedDates = Object.keys(sessionsByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  return (
    <div className="space-y-6">
      {sortedDates.map(date => (
        <div key={date}>
          <h4 className="font-medium text-sm mb-2">{date}</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionsByDate[date].map(session => {
                // Calculate duration
                let duration = "In progress";
                if (session.end_time) {
                  const start = new Date(session.start_time);
                  const end = new Date(session.end_time);
                  const durationMs = end.getTime() - start.getTime();
                  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
                  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                  
                  if (durationHours > 0) {
                    duration = `${durationHours}h ${durationMinutes}m`;
                  } else {
                    duration = `${durationMinutes}m`;
                  }
                }
                
                return (
                  <TableRow key={session.id}>
                    <TableCell>{formatTime(session.start_time)}</TableCell>
                    <TableCell>
                      {session.end_time ? formatTime(session.end_time) : "In progress"}
                    </TableCell>
                    <TableCell>{duration}</TableCell>
                    <TableCell>
                      ${session.earnings?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        session.status === 'active' ? "secondary" : 
                        session.status === 'completed' ? "outline" : 
                        "destructive"
                      }>
                        {session.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default StaffWorkSessionTable;
