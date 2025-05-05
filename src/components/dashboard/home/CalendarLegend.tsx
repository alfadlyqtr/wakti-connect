
import React from "react";

interface CalendarLegendProps {
  showBookings?: boolean;
  showEvents?: boolean;
  showManualEntries?: boolean;
}

const CalendarLegend: React.FC<CalendarLegendProps> = ({ 
  showBookings = false,
  showEvents = false,
  showManualEntries = false
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
      <div className="flex items-center">
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500 mr-1.5"></span>
        <span>Tasks</span>
      </div>
      
      {showBookings && (
        <div className="flex items-center">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500 mr-1.5"></span>
          <span>Bookings</span>
        </div>
      )}

      {showEvents && (
        <div className="flex items-center">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-500 mr-1.5"></span>
          <span>Events</span>
        </div>
      )}

      {showManualEntries && (
        <div className="flex items-center">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-500 mr-1.5"></span>
          <span>Manual Entries</span>
        </div>
      )}
    </div>
  );
};

export default CalendarLegend;
