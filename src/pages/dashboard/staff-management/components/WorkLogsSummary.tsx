
import React from "react";
import { Clock, DollarSign } from "lucide-react";
import { CardFooter } from "@/components/ui/card";
import { WorkLog } from "../types";
import { 
  calculateTotalDuration,
  formatTotalDuration,
  calculateTotalEarnings,
  countCompletedSessions
} from "../utils/workLogUtils";

interface WorkLogsSummaryProps {
  workLogs: WorkLog[];
}

const WorkLogsSummary: React.FC<WorkLogsSummaryProps> = ({ workLogs }) => {
  return (
    <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between border-t pt-4">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">
          Total Time: <span className="font-medium">{formatTotalDuration(calculateTotalDuration(workLogs))}</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">
          Sessions: <span className="font-medium">{workLogs.length} total</span> 
          <span className="text-muted-foreground"> ({countCompletedSessions(workLogs)} completed)</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">
          Total Earnings: <span className="font-medium">${calculateTotalEarnings(workLogs).toFixed(2)}</span>
        </span>
      </div>
    </CardFooter>
  );
};

export default WorkLogsSummary;
