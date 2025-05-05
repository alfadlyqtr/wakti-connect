
import React from "react";

interface CalendarLegendProps {
  showBookings?: boolean;
  showManualEntries?: boolean;
  showEvents?: boolean;
  showReminders?: boolean;
}

const CalendarLegend: React.FC<CalendarLegendProps> = ({ 
  showBookings = false,
  showManualEntries = false,
  showEvents = false,
  showReminders = false
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-2">
      <div className="flex items-center">
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500 mr-1.5"></span>
        <span>Tasks</span>
      </div>
      
      {showManualEntries && (
        <div className="flex items-center">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-500 mr-1.5"></span>
          <span>Manual Entries</span>
        </div>
      )}
      
      {showEvents && (
        <div className="flex items-center">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500 mr-1.5"></span>
          <span>Events</span>
        </div>
      )}
      
      {showReminders && (
        <div className="flex items-center">
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 mr-1.5"></span>
          <span>Reminders</span>
        </div>
      )}
      
      {showBookings && (
        <div className="flex items-center">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500 mr-1.5"></span>
          <span>Bookings</span>
        </div>
      )}
    </div>
  );
};

export default CalendarLegend;
