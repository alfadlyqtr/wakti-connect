
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: string | Error;
  title?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  title = "Error", 
  onRetry,
  isRetrying = false
}) => {
  const errorMessage = error instanceof Error ? error.message : error;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <Alert variant="destructive" className="flex items-start">
            <AlertTriangle className="h-5 w-5 mt-0.5" />
            <div className="ml-2">
              <AlertTitle>{title}</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </div>
          </Alert>
          
          {onRetry && (
            <div className="flex justify-center">
              <Button 
                onClick={onRetry} 
                disabled={isRetrying}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isRetrying ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Retrying...
                  </>
                ) : (
                  "Try again"
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorDisplay;
