
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";
import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
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
  const [duration, setDuration] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef<boolean>(true);
  const { formatCurrency } = useCurrencyFormat({});
  
  // Safe cleanup and timer management
  const cleanupTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  // Reset timer and set up new one
  const setupTimer = () => {
    // First clean up any existing timer
    cleanupTimer();
    
    // Only start a new timer if the job is not completed and component is mounted
    if (jobCard.end_time || !mountedRef.current) {
      return;
    }
    
    // Safe duration calculation and formatting
    const updateDuration = () => {
      if (!mountedRef.current) return;
      
      try {
        const startTime = new Date(jobCard.start_time);
        const now = new Date();
        const duration = intervalToDuration({ start: startTime, end: now });
        
        // Format the duration
        let formattedDuration = "";
        
        if (duration.hours && duration.hours > 0) {
          formattedDuration += `${duration.hours}h `;
        }
        
        if (duration.minutes && duration.minutes > 0) {
          formattedDuration += `${duration.minutes}m `;
        }
        
        formattedDuration += `${duration.seconds || 0}s`;
        
        setDuration(formattedDuration);
      } catch (error) {
        console.error("[ActiveJobCard] Error updating duration:", error);
        // Set a fallback duration to avoid UI issues
        setDuration("--:--");
      }
    };

    // Update immediately and then every second
    updateDuration();
    timerRef.current = setInterval(updateDuration, 1000);
    console.log("[ActiveJobCard] Timer started for job:", jobCard.id);
  };
  
  // Setup timer on initial render and when job card or completion state changes
  useEffect(() => {
    mountedRef.current = true;
    console.log("[ActiveJobCard] Setting up timer for job:", jobCard.id);
    setupTimer();
    
    // Cleanup function
    return () => {
      console.log("[ActiveJobCard] Cleaning up timer for job:", jobCard.id);
      mountedRef.current = false;
      cleanupTimer();
    };
  }, [jobCard.start_time, jobCard.end_time]);
  
  // If job already has an end_time, don't render
  if (jobCard.end_time) {
    console.log("[ActiveJobCard] Skipping render for completed job:", jobCard.id);
    return null;
  }
  
  const handleComplete = async () => {
    console.log("[ActiveJobCard] Completing job:", jobCard.id);
    
    try {
      // Immediately clean up the timer to stop counting
      cleanupTimer();
      
      // Call the parent handler
      await onCompleteJob(jobCard.id);
      console.log("[ActiveJobCard] Job completed successfully:", jobCard.id);
    } catch (error) {
      console.error("[ActiveJobCard] Error in handleComplete:", error);
      
      // If there's an error, restart the timer
      setupTimer();
      
      // Throw error to be caught by parent component
      throw error;
    }
  };
  
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
              {duration || "calculating..."}
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
            disabled={isCompleting}
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
