
import React, { useState } from 'react';
import EnhancedCalendar from '@/components/calendar/EnhancedCalendar';
import CalendarLegend from '@/components/dashboard/home/CalendarLegend';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CalendarEntryDialog from '@/components/calendar/CalendarEntryDialog';
import { supabase } from '@/integrations/supabase/client';

const DashboardCalendarPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Get user ID when component mounts
  React.useEffect(() => {
    const getUserId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    
    getUserId();
  }, []);

  return (
    <div className="w-full h-full mx-auto px-2 py-4 md:px-4 md:py-6">
      <Card className="mb-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium mb-1">Calendar Event Types</h3>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsDialogOpen(true)}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Entry
            </Button>
          </div>
          <CalendarLegend 
            showBookings={true} 
            showEvents={true} 
            showManualEntries={true} 
          />
        </CardContent>
      </Card>
      
      <EnhancedCalendar />

      {isDialogOpen && userId && (
        <CalendarEntryDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={() => {}}
          selectedDate={new Date()}
          userId={userId}
        />
      )}
    </div>
  );
};

export default DashboardCalendarPage;
