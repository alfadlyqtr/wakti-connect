
import React, { useState } from "react";
import { useStaffWorkLogs } from "@/hooks/useStaffWorkLogs";
import { StaffCard } from "@/components/staff/StaffCard";
import { EmptyStaffState } from "@/components/staff/EmptyStaffState";

const DashboardWorkLogs = () => {
  const [expandedStaff, setExpandedStaff] = useState<string[]>([]);
  const { data: staffData, isLoading } = useStaffWorkLogs();

  const toggleStaffExpansion = (staffId: string) => {
    if (expandedStaff.includes(staffId)) {
      setExpandedStaff(expandedStaff.filter(id => id !== staffId));
    } else {
      setExpandedStaff([...expandedStaff, staffId]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Staff Work Logs</h1>
        <p className="text-muted-foreground">Track staff hours, sessions, and earnings</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {!staffData || staffData.length === 0 ? (
            <EmptyStaffState />
          ) : (
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
          )}
        </>
      )}
    </div>
  );
};

export default DashboardWorkLogs;
