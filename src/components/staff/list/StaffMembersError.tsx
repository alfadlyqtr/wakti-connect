
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface StaffMembersErrorProps {
  errorMessage: string;
  onRetry: () => void;
}

const StaffMembersError: React.FC<StaffMembersErrorProps> = ({ errorMessage, onRetry }) => {
  return (
    <Card className="col-span-full p-6">
      <div className="flex items-center text-destructive space-x-2 mb-4">
        <AlertCircle className="h-5 w-5" />
        <p className="font-medium">Failed to load staff members</p>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>
      <Button size="sm" onClick={onRetry}>Retry</Button>
    </Card>
  );
};

export default StaffMembersError;
