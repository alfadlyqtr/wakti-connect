
import React, { useState } from "react";
import { Filter } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface Staff {
  id: string;
  name: string;
}

interface WorkLogFiltersProps {
  staffMembers: Staff[] | undefined;
  selectedStaff: string | null;
  onStaffChange: (value: string) => void;
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  customStartDate: string;
  onStartDateChange: (value: string) => void;
  customEndDate: string;
  onEndDateChange: (value: string) => void;
}

const timeRanges = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Last 30 Days", value: "30days" },
  { label: "All Time", value: "all" }
];

const WorkLogFilters: React.FC<WorkLogFiltersProps> = ({
  staffMembers,
  selectedStaff,
  onStaffChange,
  timeRange,
  onTimeRangeChange,
  customStartDate,
  onStartDateChange,
  customEndDate,
  onEndDateChange
}) => {
  const [showCustomDateFilter, setShowCustomDateFilter] = useState(timeRange === 'custom');

  const handleTimeRangeChange = (value: string) => {
    onTimeRangeChange(value);
    if (value === 'custom') {
      setShowCustomDateFilter(true);
    } else {
      setShowCustomDateFilter(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between">
      <div className="flex flex-col sm:flex-row gap-2">
        <Select 
          value={selectedStaff || ""} 
          onValueChange={onStaffChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select staff member" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="" disabled>Select staff member</SelectItem>
            {staffMembers?.map(staff => (
              <SelectItem key={staff.id} value={staff.id}>
                {staff.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={timeRange} 
          onValueChange={handleTimeRangeChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map(range => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
        
        {timeRange === 'custom' && (
          <Popover open={showCustomDateFilter} onOpenChange={setShowCustomDateFilter}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Custom Range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <h4 className="font-medium">Custom Date Range</h4>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label htmlFor="start-date">Start Date</label>
                    <Input
                      id="start-date"
                      type="date"
                      value={customStartDate}
                      onChange={(e) => onStartDateChange(e.target.value)}
                      className="col-span-2"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label htmlFor="end-date">End Date</label>
                    <Input
                      id="end-date"
                      type="date"
                      value={customEndDate}
                      onChange={(e) => onEndDateChange(e.target.value)}
                      className="col-span-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={() => setShowCustomDateFilter(false)}
                    size="sm"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default WorkLogFilters;
