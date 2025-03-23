
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import JobCardsRetryButton from "./JobCardsRetryButton";

interface JobCardsErrorProps {
  error: string;
  onRetry: () => void;
  isRetrying: boolean;
}

const JobCardsError: React.FC<JobCardsErrorProps> = ({ 
  error, 
  onRetry, 
  isRetrying 
}) => {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
      <JobCardsRetryButton onRetry={onRetry} isRetrying={isRetrying} />
    </div>
  );
};

export default JobCardsError;
