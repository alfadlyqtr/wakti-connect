
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2">
            <Switch 
              id="auto-approve" 
              checked={autoApprove} 
              onCheckedChange={onToggle}
              disabled={isUpdating}
            />
            <Label htmlFor="auto-approve" className="flex items-center cursor-pointer">
              Auto-approve requests
              {isUpdating && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
            </Label>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Automatically approve all contact requests without manually reviewing them</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AutoApproveToggle;
