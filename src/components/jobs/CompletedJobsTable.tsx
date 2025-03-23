
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatDuration, formatCurrency } from "@/utils/formatUtils";
import { JobCard } from "@/types/jobs.types";

interface CompletedJobsTableProps {
  completedJobs: JobCard[];
  jobCountByDate: Record<string, number>;
}

const CompletedJobsTable: React.FC<CompletedJobsTableProps> = ({ 
  completedJobs,
  jobCountByDate 
}) => {
  if (completedJobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No completed jobs found for the selected period.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Payment</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {completedJobs.map(jobCard => {
          // Calculate duration
          let duration = "N/A";
          if (jobCard.end_time) {
            const start = new Date(jobCard.start_time);
            const end = new Date(jobCard.end_time);
            duration = formatDuration(start, end);
          }
          
          // Group by date
          const dateStr = format(new Date(jobCard.start_time), "yyyy-MM-dd");
          const isFirstInGroup = completedJobs.findIndex(
            card => format(new Date(card.start_time), "yyyy-MM-dd") === dateStr
          ) === completedJobs.indexOf(jobCard);
          
          return (
            <React.Fragment key={jobCard.id}>
              {isFirstInGroup && (
                <TableRow className="bg-muted/30">
                  <TableCell colSpan={4}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {format(new Date(jobCard.start_time), "EEEE, MMMM d, yyyy")}
                      </span>
                      <Badge variant="outline">
                        {jobCountByDate[dateStr]} jobs
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell className="font-medium">
                  {jobCard.job?.name || "Unknown Job"}
                </TableCell>
                <TableCell>{format(new Date(jobCard.start_time), "h:mm a")}</TableCell>
                <TableCell>{duration}</TableCell>
                <TableCell>
                  {jobCard.payment_method === 'none' 
                    ? "No payment" 
                    : `${formatCurrency(jobCard.payment_amount)} (${jobCard.payment_method.toUpperCase()})`}
                </TableCell>
              </TableRow>
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default CompletedJobsTable;
