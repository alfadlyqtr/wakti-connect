
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface AutoApproveToggleProps {
  autoApprove: boolean;
  isUpdating: boolean;
  onToggle: () => void;
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
      <div className="flex items-center gap-2">
        <Label htmlFor="auto-approve">Auto-approve requests</Label>
        {isUpdating && <Loader2 className="h-3 w-3 animate-spin" />}
      </div>
    </div>
  );
};

export default AutoApproveToggle;
