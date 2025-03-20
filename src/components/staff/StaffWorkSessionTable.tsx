
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { Clock, DollarSign } from "lucide-react";

interface WorkSession {
  id: string;
  start_time: string;
  end_time: string | null;
  earnings: number | null;
  notes: string | null;
  status: 'active' | 'completed' | 'cancelled';
}

interface StaffWorkSessionTableProps {
  sessions: WorkSession[];
}

export const StaffWorkSessionTable: React.FC<StaffWorkSessionTableProps> = ({ sessions }) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No work sessions recorded
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Earnings</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map(session => {
            const startDate = new Date(session.start_time);
            const endDate = session.end_time ? new Date(session.end_time) : null;
            const duration = endDate 
              ? formatDistance(endDate, startDate)
              : 'In progress';
              
            return (
              <TableRow key={session.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    {startDate.toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </TableCell>
                <TableCell>{duration}</TableCell>
                <TableCell>
                  {session.earnings ? (
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                      {session.earnings.toFixed(2)}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={
                    session.status === 'active' ? 'secondary' :
                    session.status === 'completed' ? 'outline' : 
                    'destructive'
                  }>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
