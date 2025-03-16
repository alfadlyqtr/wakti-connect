
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import type { WorkSession } from "@/hooks/useStaffWorkLogs";
import { calculateHours, formatDate, formatTime } from "@/utils/dateUtils";

interface StaffWorkSessionTableProps {
  sessions: WorkSession[];
}

export const StaffWorkSessionTable = ({ sessions }: StaffWorkSessionTableProps) => {
  if (sessions.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-4">
        No work sessions recorded yet
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>End Time</TableHead>
          <TableHead>Hours</TableHead>
          <TableHead>Earnings</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map(session => (
          <TableRow key={session.id}>
            <TableCell>{formatDate(session.date)}</TableCell>
            <TableCell>{formatTime(session.start_time)}</TableCell>
            <TableCell>{formatTime(session.end_time)}</TableCell>
            <TableCell>{calculateHours(session.start_time, session.end_time)}</TableCell>
            <TableCell>${session.earnings.toFixed(2)}</TableCell>
            <TableCell className="max-w-xs truncate">{session.notes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
