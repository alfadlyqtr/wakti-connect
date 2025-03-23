
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface JobCompletionErrorProps {
  error: string | Error | null;
}

const JobCompletionError: React.FC<JobCompletionErrorProps> = ({ error }) => {
  if (!error) return null;
  
  const errorMessage = error instanceof Error ? error.message : error;
  
  return (
    <Alert variant="destructive" className="mb-4 flex items-start">
      <AlertCircle className="h-5 w-5 mt-0.5" />
      <div className="ml-2">
        <AlertTitle>Error completing job</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </div>
    </Alert>
  );
};

export default JobCompletionError;
