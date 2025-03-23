
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
import { CheckCircle } from "lucide-react";

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
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {completedJobs.map((jobCard, index) => {
          // Calculate duration
          let duration = "N/A";
          if (jobCard.end_time) {
            const start = new Date(jobCard.start_time);
            const end = new Date(jobCard.end_time);
            duration = formatDuration(start, end);
          }
          
          // Group by date
          const dateStr = format(new Date(jobCard.start_time), "yyyy-MM-dd");
          const isFirstInGroup = index === 0 || 
            format(new Date(completedJobs[index-1].start_time), "yyyy-MM-dd") !== dateStr;
          
          return (
            <React.Fragment key={`${jobCard.id}-${index}`}>
              {isFirstInGroup && (
                <TableRow className="bg-muted/30">
                  <TableCell colSpan={5}>
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
                <TableCell>
                  <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-md 
                               bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300
                               border border-green-300 dark:border-green-800 rotate-[-5deg] font-bold text-xs
                               shadow-sm">
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    COMPLETED
                  </div>
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
