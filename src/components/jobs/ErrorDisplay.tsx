
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium text-destructive">Error</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorDisplay;
