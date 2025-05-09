
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface BusinessHoursDisplayProps {
  businessHours: string;
}

type DaySchedule = {
  day: string;
  open: string;
  close: string;
  closed: boolean;
};

const BusinessHoursDisplay: React.FC<BusinessHoursDisplayProps> = ({ businessHours }) => {
  const [hours, setHours] = useState<DaySchedule[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(-1);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  useEffect(() => {
    try {
      if (businessHours) {
        const parsed = JSON.parse(businessHours);
        if (Array.isArray(parsed)) {
          setHours(parsed);
          
          // Find current day index
          const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
          const todayName = days[today];
          const index = parsed.findIndex(h => h.day === todayName);
          setCurrentDayIndex(index);
        }
      }
    } catch (e) {
      console.error("Error parsing business hours:", e);
    }
  }, [businessHours]);

  if (!hours || hours.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Business Hours</CardTitle>
        {currentDayIndex >= 0 && (
          <Badge variant={hours[currentDayIndex]?.closed ? "destructive" : "outline"} className="ml-auto">
            {hours[currentDayIndex]?.closed ? "Closed Today" : "Open Today"}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {hours.map((schedule, index) => (
            <div 
              key={schedule.day} 
              className={`flex justify-between items-center py-2 ${
                index === currentDayIndex ? 'font-medium bg-muted/50 px-2 -mx-2 rounded-md' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                {index === currentDayIndex && <Clock className="h-3 w-3 text-muted-foreground" />}
                <span>{schedule.day}</span>
              </div>
              <div>
                {schedule.closed ? (
                  <span className="text-muted-foreground">Closed</span>
                ) : (
                  <span>
                    {schedule.open} - {schedule.close}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessHoursDisplay;
