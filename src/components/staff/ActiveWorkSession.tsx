
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format, intervalToDuration } from "date-fns";
import { Clock, Calendar } from "lucide-react";

interface ActiveWorkSessionProps {
  session: any | null;
}

const ActiveWorkSession: React.FC<ActiveWorkSessionProps> = ({ session }) => {
  const [duration, setDuration] = React.useState<string>("");
  
  React.useEffect(() => {
    if (!session) return;
    
    const updateDuration = () => {
      const startTime = new Date(session.start_time);
      const now = new Date();
      
      const duration = intervalToDuration({ start: startTime, end: now });
      
      // Format the duration
      const hours = duration.hours ? `${duration.hours}h ` : '';
      const minutes = duration.minutes ? `${duration.minutes}m` : '0m';
      
      setDuration(`${hours}${minutes}`);
    };
    
    // Update immediately
    updateDuration();
    
    // Then update every minute
    const interval = setInterval(updateDuration, 60000);
    return () => clearInterval(interval);
  }, [session]);
  
  if (!session) return null;
  
  return (
    <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
            <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-medium text-green-700 dark:text-green-400">Active Work Session</h3>
            <p className="text-sm text-muted-foreground">
              Started at {format(new Date(session.start_time), "h:mm a")}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{format(new Date(session.start_time), "MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Duration: {duration}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveWorkSession;
