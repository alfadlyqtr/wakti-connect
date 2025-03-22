
import React from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const EmptyStaffState: React.FC = () => {
  return (
    <Card className="text-center p-8">
      <div className="flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Staff Members</h3>
        <p className="text-muted-foreground mt-2 mb-6">
          You haven't created any staff accounts yet.
        </p>
      </div>
    </Card>
  );
};

export default EmptyStaffState;
