
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, StopCircle, Clock } from "lucide-react";
import { differenceInSeconds } from "date-fns";

interface WorkDaySectionProps {
  activeWorkSession: any;
  onStartWorkDay: () => void;
  onEndWorkDay: () => void;
  onCreateJobCard: () => void;
}

const WorkDaySection: React.FC<WorkDaySectionProps> = ({
  activeWorkSession,
  onStartWorkDay,
  onEndWorkDay,
  onCreateJobCard
}) => {
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  
  useEffect(() => {
    const isActive = !!activeWorkSession && !activeWorkSession.end_time;
    setIsSessionActive(isActive);
    
    if (!isActive) {
      setElapsedTime("00:00:00");
      return;
    }
    
    const updateElapsedTime = () => {
      if (!activeWorkSession || !activeWorkSession.start_time) {
        setElapsedTime("00:00:00");
        return;
      }
      
      try {
        const startTime = new Date(activeWorkSession.start_time);
        const now = new Date();
        const diffSeconds = differenceInSeconds(now, startTime);
        
        // Convert to HH:MM:SS format
        const hours = Math.floor(diffSeconds / 3600);
        const minutes = Math.floor((diffSeconds % 3600) / 60);
        const seconds = diffSeconds % 60;
        
        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      } catch (error) {
        console.error("Error calculating elapsed time:", error);
        setElapsedTime("00:00:00");
      }
    };
    
    // Update immediately
    updateElapsedTime();
    
    // Set up interval
    const interval = setInterval(updateElapsedTime, 1000);
    
    return () => clearInterval(interval);
  }, [activeWorkSession]);
  
  return (
    <Card className="bg-white/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Work Day Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <div className="text-sm text-muted-foreground mb-1">Current Session</div>
            <div className="text-3xl font-bold flex items-center">
              <Clock className="h-6 w-6 mr-2 text-blue-500" />
              <span>{elapsedTime}</span>
            </div>
          </div>
          
          <div className="space-x-2">
            {!isSessionActive ? (
              <Button onClick={onStartWorkDay} className="bg-green-500 hover:bg-green-600">
                <PlayCircle className="h-5 w-5 mr-2" />
                Start Work Day
              </Button>
            ) : (
              <Button onClick={onEndWorkDay} variant="destructive">
                <StopCircle className="h-5 w-5 mr-2" />
                End Work Day
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      {isSessionActive && (
        <CardFooter className="pt-0">
          <div className="text-sm text-muted-foreground">
            Session started at {activeWorkSession ? new Date(activeWorkSession.start_time).toLocaleTimeString() : '--:--:--'}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default WorkDaySection;
