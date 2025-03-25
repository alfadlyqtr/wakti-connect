
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle } from 'lucide-react';
import { formatCurrency, formatTime } from '@/utils/formatUtils';
import { JobCard } from '@/types/jobs.types';
import { intervalToDuration } from 'date-fns';

interface ActiveJobCardProps {
  jobCard: JobCard;
  onComplete: () => void;
  isCompleting: boolean;
}

const ActiveJobCard: React.FC<ActiveJobCardProps> = ({ 
  jobCard, 
  onComplete,
  isCompleting
}) => {
  const [duration, setDuration] = useState<string>("");
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  
  // Update duration display
  const updateDuration = () => {
    try {
      const startTime = new Date(jobCard.start_time);
      const now = new Date();
      const duration = intervalToDuration({ start: startTime, end: now });
      
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
      console.error("Error calculating duration:", error);
      setDuration("--:--");
    }
  };
  
  // Set up interval for duration counter
  useEffect(() => {
    if (jobCard.end_time) {
      return; // Don't start timer for completed jobs
    }
    
    // Update immediately and then every second
    updateDuration();
    const id = setInterval(updateDuration, 1000);
    setIntervalId(id);
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [jobCard.start_time, jobCard.end_time]);
  
  // Clean up interval when component unmounts
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);
  
  // Log job data to debug
  console.log("ActiveJobCard job data:", jobCard);
  console.log("Job name from job relation:", jobCard.job?.name);
  
  return (
    <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
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
              Started at {formatTime(jobCard.start_time)}
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
            onClick={onComplete} 
            className="w-full" 
            disabled={isCompleting || !!jobCard.end_time}
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
