
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AutoApproveToggleProps {
  autoApprove: boolean;
  isUpdating: boolean;
  onToggle: () => Promise<void>;
}

const AutoApproveToggle: React.FC<AutoApproveToggleProps> = ({ 
  autoApprove, 
  isUpdating, 
  onToggle 
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="auto-approve" 
        checked={autoApprove} 
        onCheckedChange={onToggle}
        disabled={isUpdating}
      />
      <Label htmlFor="auto-approve">Auto-approve contact requests</Label>
    </div>
  );
};

export default AutoApproveToggle;
