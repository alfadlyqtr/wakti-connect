
import React, { useMemo } from "react";
import { useStaffWorkLogs } from "@/hooks/useStaffWorkLogs";
import StaffList from "@/components/staff/StaffList";
import { StaffMember } from "@/components/staff/StaffMemberCard";

const DashboardWorkLogs = () => {
  const { data: staffData, isLoading } = useStaffWorkLogs();

  // Convert StaffWithSessions to StaffMember format
  const formattedStaffMembers = useMemo(() => {
    if (!staffData) return [];
    
    return staffData.map(staff => {
      // Create a StaffMember object from StaffWithSessions
      const staffMember: StaffMember = {
        id: staff.id,
        name: staff.name,
        email: staff.email || null,
        role: 'staff',  // Default role
        position: 'Staff Member', // Default position
        created_at: new Date().toISOString(), // Default creation date
        staff_number: `STAFF-${staff.id.substring(0, 5)}`,
        is_service_provider: false,
        status: 'active',
        profile_image_url: null,
        permissions: {
          service_permission: 'none',
          booking_permission: 'none',
          staff_permission: 'none',
          analytics_permission: 'none'
        }
      };
      
      return staffMember;
    });
  }, [staffData]);

  // Create empty handler functions for required props
  const handleCreateStaff = () => {
    console.log("Create staff functionality not implemented in work logs view");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Staff Work Logs</h1>
        <p className="text-muted-foreground">Track staff hours, sessions, and earnings</p>
      </div>
      
      <StaffList 
        staffMembers={formattedStaffMembers} 
        isLoading={isLoading} 
        hasError={false}
        onCreateStaff={handleCreateStaff}
        onEditStaff={() => {}}
        onSuspendStaff={() => {}}
        onDeleteStaff={() => {}}
        onReactivateStaff={() => {}}
      />
    </div>
  );
};

export default DashboardWorkLogs;
