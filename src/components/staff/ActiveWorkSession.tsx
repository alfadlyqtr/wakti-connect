
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatTime } from "@/utils/dateUtils";
import { Clock } from "lucide-react";

interface ActiveWorkSessionProps {
  session: any;
}

const ActiveWorkSession: React.FC<ActiveWorkSessionProps> = ({ session }) => {
  const [elapsedTime, setElapsedTime] = useState<string>("0:00:00");
  
  useEffect(() => {
    if (!session) return;
    
    const updateElapsedTime = () => {
      const startTime = new Date(session.start_time).getTime();
      const now = new Date().getTime();
      const diffMs = now - startTime;
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      setElapsedTime(
        `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };
    
    // Update immediately
    updateElapsedTime();
    
    // Then update every second
    const interval = setInterval(updateElapsedTime, 1000);
    
    return () => clearInterval(interval);
  }, [session]);
  
  if (!session) return null;
  
  return (
    <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
            <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-medium text-green-700 dark:text-green-400">Active Work Session</h3>
            <p className="text-sm text-green-600 dark:text-green-500">
              Started at {formatTime(session.start_time)}
            </p>
            <p className="text-sm font-mono mt-1 text-green-800 dark:text-green-300">
              Duration: {elapsedTime}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveWorkSession;
