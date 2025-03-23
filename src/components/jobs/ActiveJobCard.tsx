
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";
import { formatDateTime } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatUtils";
import { JobCard } from "@/types/jobs.types";
import { format, intervalToDuration } from "date-fns";

interface ActiveJobCardProps {
  jobCard: JobCard;
  onCompleteJob: (jobCardId: string) => void;
  isCompleting: boolean;
}

const ActiveJobCard: React.FC<ActiveJobCardProps> = ({ 
  jobCard, 
  onCompleteJob,
  isCompleting
}) => {
  const [duration, setDuration] = useState<string>("");
  const [now, setNow] = useState(new Date());
  
  // Don't show this component if the job has an end_time
  if (jobCard.end_time) {
    return null;
  }
  
  useEffect(() => {
    // Update the current time every second for the timer
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    if (jobCard.end_time) return; // Don't update duration if job is completed
    
    const startTime = new Date(jobCard.start_time);
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
  }, [jobCard, now]);
  
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
            onClick={() => onCompleteJob(jobCard.id)} 
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
