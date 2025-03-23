
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Filter } from "lucide-react";

export type FilterPeriod = "all" | "today" | "thisWeek" | "thisMonth";

interface JobsFilterPeriodProps {
  value: FilterPeriod;
  onChange: (value: FilterPeriod) => void;
}

const JobsFilterPeriod: React.FC<JobsFilterPeriodProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={(value) => onChange(value as FilterPeriod)}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Filter period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="thisWeek">This week</SelectItem>
          <SelectItem value="thisMonth">This month</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default JobsFilterPeriod;
