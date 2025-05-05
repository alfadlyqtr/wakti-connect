
import React from 'react';
import EnhancedCalendar from '@/components/calendar/EnhancedCalendar';

const DashboardCalendarPage: React.FC = () => {
  return (
    <div className="w-full h-full mx-auto px-2 py-4 md:px-4 md:py-6">
      <EnhancedCalendar />
    </div>
  );
};

export default DashboardCalendarPage;
