
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Repeat } from "lucide-react";

interface RecurringBadgeProps {
  className?: string;
  frequency?: string;
  isRecurringInstance?: boolean;
}

const RecurringBadge: React.FC<RecurringBadgeProps> = ({ 
  className, 
  frequency,
  isRecurringInstance = false
}) => {
  return (
    <Badge variant="outline" className={className}>
      <Repeat className="h-3 w-3 mr-1" />
      <span>{isRecurringInstance ? "Instance" : frequency ? `${frequency}` : "Recurring"}</span>
    </Badge>
  );
};

export default RecurringBadge;
