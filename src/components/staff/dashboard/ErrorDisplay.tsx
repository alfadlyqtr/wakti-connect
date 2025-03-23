
import React from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  error: Error;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-2xl font-medium">Error Loading Dashboard</h3>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          We encountered a problem loading your staff dashboard. Please try again or contact support.
        </p>
        <pre className="mt-4 p-4 bg-muted text-xs overflow-auto max-w-md">
          {error.message || "Unknown error"}
        </pre>
      </div>
    </Card>
  );
};

export default ErrorDisplay;
