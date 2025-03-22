
import React from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StaffErrorStateProps {
  error: Error | null;
  authError: boolean;
  onRetry: () => void;
}

const StaffErrorState: React.FC<StaffErrorStateProps> = ({ 
  error, 
  authError, 
  onRetry 
}) => {
  return (
    <Card className="col-span-full p-8">
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error loading staff</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{error instanceof Error ? error.message : "Failed to load staff members"}</p>
          {authError && (
            <p className="font-semibold">There appears to be an authentication issue. Please try refreshing the page or signing in again.</p>
          )}
        </AlertDescription>
      </Alert>
      <div className="flex justify-center mt-4">
        <Button onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </Card>
  );
};

export default StaffErrorState;
