
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format, intervalToDuration } from "date-fns";
import { Clock, Calendar } from "lucide-react";

interface ActiveWorkSessionProps {
  session: any | null;
}

const ActiveWorkSession: React.FC<ActiveWorkSessionProps> = ({ session }) => {
  const [duration, setDuration] = useState<string>("");
  const [now, setNow] = useState(new Date());
  
  useEffect(() => {
    if (!session) return;
    
    // Update the current time every second
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [session]);
  
  useEffect(() => {
    if (!session) return;
    
    const startTime = new Date(session.start_time);
    
    const duration = intervalToDuration({ start: startTime, end: now });
    
    // Format the duration
    let formattedDuration = "";
    
    if (duration.hours) {
      formattedDuration += `${duration.hours}h `;
    }
    
    if (duration.minutes) {
      formattedDuration += `${duration.minutes}m `;
    }
    
    formattedDuration += `${duration.seconds}s`;
    
    setDuration(formattedDuration);
  }, [session, now]);
  
  if (!session) return null;
  
  const startDate = new Date(session.start_time);
  
  return (
    <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 my-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
            <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-medium text-green-700 dark:text-green-400">Active Work Session</h3>
            <p className="text-sm text-muted-foreground">
              Started at {format(startDate, "h:mm a")} on {format(startDate, "MMMM d, yyyy")}
            </p>
          </div>
          <div className="ml-auto text-right">
            <span className="text-xl font-bold text-green-700 dark:text-green-400">
              {duration}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mt-2 p-2 bg-green-100/50 dark:bg-green-900/20 rounded">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Started: {format(startDate, "MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Current Time: {format(now, "h:mm:ss a")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveWorkSession;
