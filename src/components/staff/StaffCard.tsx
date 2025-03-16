
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ChevronDown } from "lucide-react";
import { StaffWorkSessionTable } from "./StaffWorkSessionTable";
import type { StaffWithSessions } from "@/hooks/useStaffWorkLogs";

interface StaffCardProps {
  staff: StaffWithSessions;
  isExpanded: boolean;
  onToggle: () => void;
}

export const StaffCard = ({ staff, isExpanded, onToggle }: StaffCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <User className="mr-2 h-5 w-5" />
            {staff.name}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({staff.role})
            </span>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggle}
          >
            <ChevronDown className={`h-5 w-5 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`} />
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <StaffWorkSessionTable sessions={staff.sessions} />
        </CardContent>
      )}
    </Card>
  );
};
