
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StaffFormPanelProps {
  staffId?: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const StaffFormPanel: React.FC<StaffFormPanelProps> = ({ 
  staffId,
  onSuccess,
  onCancel
}) => {
  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">Staff Management Removed</h3>
          <p className="text-muted-foreground mb-4">
            Staff management functionality has been removed from this version.
          </p>
          <Button variant="outline" onClick={handleCancel}>
            Go Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffFormPanel;
