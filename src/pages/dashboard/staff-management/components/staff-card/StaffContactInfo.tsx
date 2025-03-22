
import React from "react";
import { Mail } from "lucide-react";

interface StaffContactInfoProps {
  email: string;
}

const StaffContactInfo: React.FC<StaffContactInfoProps> = ({ email }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Mail className="h-3.5 w-3.5" />
      <span className="truncate">{email}</span>
    </div>
  );
};

export default StaffContactInfo;
