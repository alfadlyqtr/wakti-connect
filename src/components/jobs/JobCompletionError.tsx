
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface JobCompletionErrorProps {
  error: string;
}

const JobCompletionError: React.FC<JobCompletionErrorProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error completing job</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default JobCompletionError;
