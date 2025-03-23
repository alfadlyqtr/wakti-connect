
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, PlayCircle, StopCircle, FileText } from 'lucide-react';
import { formatTime, formatDuration } from '@/utils/formatUtils';
import { intervalToDuration } from 'date-fns';

interface WorkStatusCardProps {
  activeWorkSession: any | null;
  onStartWorkDay: () => void;
  onEndWorkDay: () => void;
  onCreateJobCard: () => void;
  isStarting?: boolean;
  isEnding?: boolean;
}

const WorkStatusCard: React.FC<WorkStatusCardProps> = ({
  activeWorkSession,
  onStartWorkDay,
  onEndWorkDay,
  onCreateJobCard,
  isStarting = false,
  isEnding = false
}) => {
  // Calculate duration if there's an active session
  const getDuration = () => {
    if (!activeWorkSession) return null;
    
    try {
      const start = new Date(activeWorkSession.start_time);
      const now = new Date();
      const duration = intervalToDuration({ start, end: now });
      
      return (
        <>
          {duration.hours ? <span>{duration.hours}h </span> : null}
          {duration.minutes ? <span>{duration.minutes}m</span> : null}
          {!duration.hours && !duration.minutes ? <span>Just started</span> : null}
        </>
      );
    } catch (error) {
      console.error("Error calculating duration:", error);
      return <span>--:--</span>;
    }
  };
  
  return (
    <Card className={activeWorkSession ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : ""}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {activeWorkSession ? (
            <>
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-green-700 dark:text-green-400">Work Day In Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    Started at {formatTime(activeWorkSession.start_time)} • Duration: {getDuration()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 ml-auto">
                <Button 
                  variant="outline" 
                  className="bg-white dark:bg-gray-800" 
                  onClick={onCreateJobCard}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Record Job
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white dark:bg-gray-800 border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 dark:text-red-400 dark:border-red-800" 
                  onClick={onEndWorkDay}
                  disabled={isEnding}
                >
                  {isEnding ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Ending...
                    </>
                  ) : (
                    <>
                      <StopCircle className="h-4 w-4 mr-2" />
                      End Day
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full mr-3">
                  <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium">Not Working</h3>
                  <p className="text-sm text-muted-foreground">
                    Start your work day to begin recording jobs
                  </p>
                </div>
              </div>
              <Button 
                variant="default" 
                onClick={onStartWorkDay} 
                className="ml-auto"
                disabled={isStarting}
              >
                {isStarting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Work Day
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkStatusCard;
