
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, AlertCircle, Loader2 } from "lucide-react";

export const LoadingState = () => (
  <Card>
    <CardContent className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Loading work logs...</p>
      </div>
    </CardContent>
  </Card>
);

export const EmptyState = ({ 
  message = "No Work Logs", 
  subMessage = "No work logs found for the selected period" 
}: { 
  message?: string; 
  subMessage?: string; 
}) => (
  <Card>
    <CardContent className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <Users className="h-8 w-8" />
        <p className="font-medium text-lg">{message}</p>
        <p className="text-sm">{subMessage}</p>
      </div>
    </CardContent>
  </Card>
);

export const ErrorState = ({ error }: { error: Error | null }) => (
  <Card>
    <CardContent className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-2 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p className="font-medium text-lg">Error Loading Work Logs</p>
        <p className="text-sm">{error?.message || "An unknown error occurred"}</p>
      </div>
    </CardContent>
  </Card>
);
