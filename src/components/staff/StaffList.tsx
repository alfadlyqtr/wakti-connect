
import React, { useState } from "react";
import { StaffCard } from "./StaffCard";
import { EmptyStaffState } from "./EmptyStaffState";
import type { StaffWithSessions } from "@/hooks/useStaffWorkLogs";

interface StaffListProps {
  staffData: StaffWithSessions[] | undefined;
  isLoading: boolean;
}

export const StaffList = ({ staffData, isLoading }: StaffListProps) => {
  const [expandedStaff, setExpandedStaff] = useState<string[]>([]);

  const toggleStaffExpansion = (staffId: string) => {
    if (expandedStaff.includes(staffId)) {
      setExpandedStaff(expandedStaff.filter(id => id !== staffId));
    } else {
      setExpandedStaff([...expandedStaff, staffId]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!staffData || staffData.length === 0) {
    return <EmptyStaffState />;
  }

  return (
    <div className="space-y-4">
      {staffData.map(staff => (
        <StaffCard 
          key={staff.id}
          staff={staff}
          isExpanded={expandedStaff.includes(staff.id)}
          onToggle={() => toggleStaffExpansion(staff.id)}
        />
      ))}
    </div>
  );
};
