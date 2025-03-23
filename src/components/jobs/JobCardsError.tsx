
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import JobCardsRetryButton from "./JobCardsRetryButton";

interface JobCardsErrorProps {
  error: string | Error;
  onRetry: () => void;
  isRetrying: boolean;
}

const JobCardsError: React.FC<JobCardsErrorProps> = ({ 
  error, 
  onRetry, 
  isRetrying 
}) => {
  const errorMessage = error instanceof Error ? error.message : error;
  
  return (
    <div className="space-y-4">
      <Alert variant="destructive" className="flex items-start">
        <AlertCircle className="h-5 w-5 mt-0.5" />
        <div className="ml-2">
          <AlertTitle>Error loading job cards</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </div>
      </Alert>
      <JobCardsRetryButton onRetry={onRetry} isRetrying={isRetrying} />
    </div>
  );
};

export default JobCardsError;
