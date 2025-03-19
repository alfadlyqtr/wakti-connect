
import React from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { FilterX, CalendarRange } from "lucide-react";
import { format } from "date-fns";

interface DateRangeFilterProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  resetFilters: () => void;
  showIndicator?: boolean;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  resetFilters,
  showIndicator = true,
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-3">
          <DatePicker
            date={startDate}
            setDate={setStartDate}
            className="w-full sm:w-[160px]"
            placeholder="Start date"
          />
          <span className="hidden sm:inline">to</span>
          <DatePicker
            date={endDate}
            setDate={setEndDate}
            className="w-full sm:w-[160px]"
            placeholder="End date"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={resetFilters}
          title="Clear filters"
        >
          <FilterX className="h-4 w-4" />
        </Button>
      </div>

      {showIndicator && (startDate || endDate) && (
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <CalendarRange className="h-4 w-4" />
          <span>
            {startDate ? format(startDate, "PPP") : "Any date"} - {endDate ? format(endDate, "PPP") : "Any date"}
          </span>
        </div>
      )}
    </>
  );
};
