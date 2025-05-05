
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CalendarViewSelector } from '@/components/calendar/CalendarViewSelector';
import { UnifiedCalendar } from '@/components/calendar/UnifiedCalendar';
import { CalendarEntryDialog } from '@/components/calendar/CalendarEntryDialog';

const DashboardCalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [view, setView] = useState<'month' | 'day' | 'week'>('month');
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage all your events, tasks, and bookings in one place.
          </p>
        </div>
        <div className="flex items-center space-x-2 self-start">
          <CalendarViewSelector value={view} onValueChange={setView} />
          <Button 
            onClick={() => setEntryDialogOpen(true)}
            className="whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" /> 
            Add Entry
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pt-4 px-4 pb-0">
          <div className="flex items-center justify-between">
            <CardTitle>{format(selectedDate, 'MMMM yyyy')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <UnifiedCalendar 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            view={view}
          />
        </CardContent>
      </Card>

      <CalendarEntryDialog 
        open={entryDialogOpen} 
        onOpenChange={setEntryDialogOpen}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default DashboardCalendarPage;
