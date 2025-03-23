
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface StaffMembersErrorProps {
  errorMessage: string;
  onRetry: () => void;
  onSync?: () => void;
  isSyncing?: boolean;
}

const StaffMembersError: React.FC<StaffMembersErrorProps> = ({ 
  errorMessage, 
  onRetry,
  onSync,
  isSyncing = false
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center text-destructive space-x-2 mb-4">
        <AlertCircle className="h-5 w-5" />
        <p className="font-medium">Failed to load staff members</p>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>
      <div className="flex gap-2">
        <Button size="sm" onClick={onRetry}>Retry</Button>
        {onSync && (
          <Button size="sm" variant="outline" onClick={onSync} disabled={isSyncing}>
            {isSyncing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isSyncing ? "Syncing..." : "Sync Staff Records"}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default StaffMembersError;
