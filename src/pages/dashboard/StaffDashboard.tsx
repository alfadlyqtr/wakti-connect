
import React from "react";
import { useStaffStatus } from "@/hooks/staff/useStaffStatus";
import StaffDashboardHeader from "@/components/dashboard/StaffDashboardHeader";
import { useStaffDetails } from "@/hooks/staff/useStaffDetails";
import { useCurrentUser } from "@/hooks/staff/useCurrentUser";
import { useStaffStats } from "@/hooks/staff/useStaffStats";
import { useWorkSession } from "@/hooks/staff/useWorkSession";
import StaffNotFound from "@/components/staff/dashboard/StaffNotFound";
import ErrorDisplay from "@/components/staff/dashboard/ErrorDisplay";
import StaffStats from "@/components/staff/dashboard/StaffStats";
import WorkDaySection from "@/components/staff/dashboard/WorkDaySection";
import WorkHistorySection from "@/components/staff/dashboard/WorkHistorySection";
import PermissionsCard from "@/components/staff/dashboard/PermissionsCard";
import BookingsWidget from "@/components/staff/dashboard/BookingsWidget";

// Type for staff permissions
interface StaffPermissions {
  can_view_tasks?: boolean;
  can_manage_tasks?: boolean;
  can_message_staff?: boolean;
  can_manage_bookings?: boolean;
  can_create_job_cards?: boolean;
  can_track_hours?: boolean;
  can_log_earnings?: boolean;
  can_edit_profile?: boolean;
  can_view_customer_bookings?: boolean;
  can_view_analytics?: boolean;
  [key: string]: boolean | undefined;
}

const StaffDashboard = () => {
  const { isStaff, staffRelationId, isLoading: staffStatusLoading } = useStaffStatus();
  const { data: { user } = { user: null }, isLoading: userLoading } = useCurrentUser();
  
  const { 
    data: staffData, 
    isLoading: staffLoading, 
    error: staffError 
  } = useStaffDetails(staffRelationId);
  
  const { 
    activeWorkSession,
    startWorkDay,
    endWorkDay,
    isLoading: sessionLoading
  } = useWorkSession(staffRelationId);
  
  const { data: stats, isLoading: statsLoading } = useStaffStats(staffRelationId, user?.id || null);
  
  // Combined loading state
  const isLoading = staffStatusLoading || userLoading || staffLoading || sessionLoading || statsLoading;

  // If not a staff member, show not found state
  if (!staffStatusLoading && !isStaff) {
    return <StaffNotFound />;
  }
  
  // Show loading state
  if (isLoading) {
    return <div className="py-8 text-center">Loading staff dashboard...</div>;
  }

  // Show error state
  if (staffError) {
    return <ErrorDisplay error={staffError} />;
  }

  // If we got here but don't have staff data, show a more specific message
  if (!staffData) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-xl font-medium mb-2">Staff Profile Not Found</h2>
        <p className="text-muted-foreground">Your staff profile could not be loaded. Please contact your business administrator.</p>
      </div>
    );
  }
  
  // Extract permissions from staff data (with fallback to empty object)
  const permissions = (staffData.permissions || {}) as StaffPermissions;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Staff Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your staff dashboard. Manage your tasks, bookings, and track your work.
        </p>
      </div>
      
      {user && <StaffDashboardHeader staffId={user.id} />}
      
      {/* Work Status Section */}
      {permissions.can_track_hours && (
        <WorkDaySection 
          activeWorkSession={activeWorkSession}
          startWorkDay={startWorkDay}
          endWorkDay={endWorkDay}
        />
      )}
      
      {/* Stats Cards */}
      <StaffStats stats={stats} permissions={permissions} />
      
      {/* Bookings Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BookingsWidget />
        
        {/* You could add other widgets in this grid too */}
      </div>
      
      {/* Work History Section */}
      {permissions.can_track_hours && staffRelationId && (
        <WorkHistorySection staffRelationId={staffRelationId} />
      )}
      
      {/* Permissions Card */}
      <PermissionsCard permissions={permissions} />
    </div>
  );
};

export default StaffDashboard;
