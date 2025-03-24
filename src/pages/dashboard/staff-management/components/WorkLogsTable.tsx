
import React from "react";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableFooter
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { WorkLog } from "../types";
import { 
  formatDuration, 
  calculateTotalDuration, 
  formatTotalDuration,
  calculateTotalEarnings,
  countCompletedSessions,
  countActiveSessions
} from "../utils/workLogUtils";

interface WorkLogsTableProps {
  workLogs: WorkLog[];
}

const WorkLogsTable: React.FC<WorkLogsTableProps> = ({ workLogs }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>End Time</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Earnings</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workLogs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>
              {format(new Date(log.start_time), 'MMM dd, yyyy')}
            </TableCell>
            <TableCell>
              {format(new Date(log.start_time), 'hh:mm a')}
            </TableCell>
            <TableCell>
              {log.end_time 
                ? format(new Date(log.end_time), 'hh:mm a')
                : "In progress"}
            </TableCell>
            <TableCell>
              {formatDuration(log.start_time, log.end_time)}
            </TableCell>
            <TableCell>
              <Badge variant={!log.end_time ? "outline" : "secondary"}>
                {!log.end_time ? "Active" : "Completed"}
              </Badge>
            </TableCell>
            <TableCell>
              {log.earnings > 0 
                ? `$${log.earnings.toFixed(2)}`
                : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="bg-muted/20">
        <TableRow>
          <TableCell colSpan={3} className="text-right font-medium">Summary Totals:</TableCell>
          <TableCell className="font-medium">{formatTotalDuration(calculateTotalDuration(workLogs))}</TableCell>
          <TableCell>
            <span className="text-sm">
              {countCompletedSessions(workLogs)} completed, 
              {countActiveSessions(workLogs) > 0 ? ` ${countActiveSessions(workLogs)} active` : ' 0 active'}
            </span>
          </TableCell>
          <TableCell className="font-medium">${calculateTotalEarnings(workLogs).toFixed(2)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default WorkLogsTable;
