
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";
import { formatDateTime } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatUtils";
import { JobCard } from "@/types/jobs.types";
import { format, intervalToDuration } from "date-fns";

interface ActiveJobCardProps {
  jobCard: JobCard;
  onCompleteJob: (jobCardId: string) => Promise<void>;
  isCompleting: boolean;
}

const ActiveJobCard: React.FC<ActiveJobCardProps> = ({ 
  jobCard, 
  onCompleteJob,
  isCompleting
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [duration, setDuration] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef<boolean>(true);
  
  // Reset timer and cleanup function
  const setupTimer = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Only start a new timer if the job is not completed and component is mounted
    if ((jobCard.end_time || isCompleted) || !mountedRef.current) {
      return;
    }
    
    // Update duration calculation function
    const updateDuration = () => {
      if (!mountedRef.current) return;
      
      try {
        const startTime = new Date(jobCard.start_time);
        const now = new Date();
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
      } catch (error) {
        console.error("Error updating duration:", error);
        // Set a fallback duration to avoid UI issues
        setDuration("--:--");
      }
    };

    // Update immediately and then every second
    updateDuration();
    timerRef.current = setInterval(updateDuration, 1000);
  };
  
  // Setup timer on initial render and when job card or completion state changes
  useEffect(() => {
    mountedRef.current = true;
    setupTimer();
    
    // Cleanup function
    return () => {
      mountedRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [jobCard.start_time, jobCard.end_time, isCompleted]);
  
  const handleComplete = async () => {
    try {
      // Immediately clean up the timer to stop counting
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Set local completion state immediately for UI
      setIsCompleted(true);
      
      // Call the parent handler
      await onCompleteJob(jobCard.id);
    } catch (error) {
      console.error("Error in handleComplete:", error);
      // If there's an error, reset the completion state
      setIsCompleted(false);
      
      // Restart the timer
      setupTimer();
    }
  };
  
  // If job already has an end_time or is locally marked as completed, don't render
  if (jobCard.end_time || isCompleted) {
    return null;
  }
  
  return (
    <Card className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
            <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h3 className="font-medium text-yellow-700 dark:text-yellow-400">
              {jobCard.job?.name || "Active Job"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Started at {format(new Date(jobCard.start_time), "h:mm a")}
            </p>
          </div>
          <div className="ml-auto text-right">
            <span className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
              {duration}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-2 mt-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payment:</span>
            <span>
              {jobCard.payment_method === 'none' 
                ? "No payment" 
                : `${formatCurrency(jobCard.payment_amount)} (${jobCard.payment_method.toUpperCase()})`}
            </span>
          </div>
          
          {jobCard.notes && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Notes:</span>
              <span className="text-right">{jobCard.notes}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <Button 
            onClick={handleComplete} 
            className="w-full" 
            disabled={isCompleting || isCompleted}
            variant="default"
          >
            {isCompleting ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Job
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveJobCard;
