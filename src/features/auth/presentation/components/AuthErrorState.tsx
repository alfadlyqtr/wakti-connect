
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AuthErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * Component to display authentication errors
 */
const AuthErrorState: React.FC<AuthErrorStateProps> = ({
  message = "Authentication failed. Please try again.",
  onRetry
}) => {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="w-full">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default AuthErrorState;
