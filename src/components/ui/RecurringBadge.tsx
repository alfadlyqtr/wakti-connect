
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Repeat } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RecurringBadgeProps {
  frequency?: string;
  isRecurringInstance?: boolean;
}

export function RecurringBadge({ frequency, isRecurringInstance }: RecurringBadgeProps) {
  if (!frequency && !isRecurringInstance) return null;
  
  const badgeText = frequency ? 
    `Repeats ${frequency.toLowerCase()}` : 
    "Recurring instance";
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="flex items-center gap-1 ml-1">
            <Repeat className="h-3 w-3" />
            <span className="hidden sm:inline">{badgeText}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {isRecurringInstance ? 
            "This is part of a recurring series" : 
            `This ${frequency?.toLowerCase()} recurring item will repeat based on your settings`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
