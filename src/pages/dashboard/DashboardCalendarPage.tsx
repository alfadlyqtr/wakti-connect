
import React from 'react';
import EnhancedCalendar from '@/components/calendar/EnhancedCalendar';
import CalendarLegend from '@/components/dashboard/home/CalendarLegend';
import { Card, CardContent } from '@/components/ui/card';

const DashboardCalendarPage: React.FC = () => {
  return (
    <div className="w-full h-full mx-auto px-2 py-4 md:px-4 md:py-6">
      <Card className="mb-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
        <CardContent className="p-3">
          <h3 className="text-sm font-medium mb-1">Calendar Event Types</h3>
          <CalendarLegend 
            showBookings={true} 
            showEvents={true} 
            showManualEntries={true} 
          />
        </CardContent>
      </Card>
      
      <EnhancedCalendar />
    </div>
  );
};

export default DashboardCalendarPage;
