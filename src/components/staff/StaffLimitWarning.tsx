
import React from "react";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

interface StaffLimitWarningProps {
  show: boolean;
}

const StaffLimitWarning: React.FC<StaffLimitWarningProps> = ({ show }) => {
  if (!show) return null;
  
  return (
    <Card className="p-4 bg-amber-50 border-amber-200">
      <div className="flex items-center gap-2 text-amber-700">
        <Users className="h-5 w-5" />
        <p className="text-sm font-medium">
          Staff limit reached (6/6). Business plan allows up to 6 staff members.
        </p>
      </div>
    </Card>
  );
};

export default StaffLimitWarning;
