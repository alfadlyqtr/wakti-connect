
import React from "react";
import { useTranslation } from "react-i18next";

interface CalendarLegendProps {
  showBookings?: boolean;
}

const CalendarLegend: React.FC<CalendarLegendProps> = ({ showBookings = false }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-2">
      <div className="flex items-center">
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500 mr-1.5"></span>
        <span>{t('calendar.tasks')}</span>
      </div>
      
      {showBookings && (
        <div className="flex items-center">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500 mr-1.5"></span>
          <span>{t('calendar.bookings')}</span>
        </div>
      )}
    </div>
  );
};

export default CalendarLegend;
