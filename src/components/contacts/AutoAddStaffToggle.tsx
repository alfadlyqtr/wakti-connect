
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Building, Loader2 } from "lucide-react";

interface AutoAddStaffToggleProps {
  autoAddStaff: boolean;
  isUpdating: boolean;
  onToggle: () => void;
}

const AutoAddStaffToggle: React.FC<AutoAddStaffToggleProps> = ({
  autoAddStaff,
  isUpdating,
  onToggle
}) => {
  return (
    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/20">
      <div className="flex flex-1 items-center space-x-2">
        <Building className="h-4 w-4 text-primary" />
        <Label htmlFor="auto-add-staff" className="text-sm font-medium flex items-center gap-2">
          Auto-add staff to contacts
          {isUpdating && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
        </Label>
      </div>
      <Switch
        id="auto-add-staff"
        checked={autoAddStaff}
        onCheckedChange={onToggle}
        disabled={isUpdating}
      />
    </div>
  );
};

export default AutoAddStaffToggle;
