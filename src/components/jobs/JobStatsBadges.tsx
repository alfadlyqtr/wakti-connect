
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Clock, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { FilterPeriod } from "./jobCardUtils";

interface JobStatsBadgesProps {
  jobCount: number;
  totalDuration: string;
  totalEarnings: number;
  filterPeriod: FilterPeriod;
  formatCurrency: (amount: number | null | undefined) => string;
}

const JobStatsBadges: React.FC<JobStatsBadgesProps> = ({ 
  jobCount, 
  totalDuration, 
  totalEarnings,
  filterPeriod,
  formatCurrency
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Badge variant="outline" className="flex items-center gap-1">
        <CheckSquare className="h-3 w-3" />
        <span>Jobs: {jobCount}</span>
      </Badge>
      
      <Badge variant="outline" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        <span>Total time: {totalDuration}</span>
      </Badge>
      
      <Badge variant="outline" className="flex items-center gap-1">
        <DollarSign className="h-3 w-3" />
        <span>Earnings: {formatCurrency(totalEarnings)}</span>
      </Badge>
      
      {filterPeriod === "today" && (
        <Badge variant="outline" className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Today: {format(new Date(), "MMM d, yyyy")}</span>
        </Badge>
      )}
    </div>
  );
};

export default JobStatsBadges;
