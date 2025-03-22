
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorStateProps {
  onRetry?: () => void;
  errorMessage?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  onRetry,
  errorMessage = "Staff member not found or could not be loaded."
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {errorMessage}
        </AlertDescription>
      </Alert>
      
      {onRetry && (
        <Button onClick={onRetry} className="mt-2">
          Try Again
        </Button>
      )}
    </div>
  );
};
