
import React, { useState } from "react";
import { useStaffStatus } from "@/hooks/useStaffStatus";
import { useStaffDetails } from "@/hooks/staff/useStaffDetails";
import { useStaffStats } from "@/hooks/staff/useStaffStats";
import { useWorkSession } from "@/hooks/staff/useWorkSession";
import StaffNotFound from "@/components/staff/dashboard/StaffNotFound";
import ErrorDisplay from "@/components/staff/dashboard/ErrorDisplay";
import StaffStats from "@/components/staff/dashboard/StaffStats";
import WorkDaySection from "@/components/staff/dashboard/WorkDaySection";
import WorkHistorySection from "@/components/staff/dashboard/WorkHistorySection";
import PermissionsCard from "@/components/staff/dashboard/PermissionsCard";
import BookingsWidget from "@/components/staff/dashboard/BookingsWidget";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { clearStaffCache } from "@/utils/staffUtils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth";

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
  can_message_customers?: boolean;
  [key: string]: boolean | undefined;
}

const StaffDashboard = () => {
  const { isStaff, staffRelationId, isLoading: staffStatusLoading } = useStaffStatus();
  const { user, userId, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { 
    data: staffData, 
    isLoading: staffLoading, 
    error: staffError,
    refetch: refetchStaffData
  } = useStaffDetails(staffRelationId);
  
  const { 
    activeWorkSession,
    startWorkDay,
    endWorkDay,
    isLoading: sessionLoading
  } = useWorkSession(staffRelationId);
  
  const { 
    data: stats, 
    isLoading: statsLoading,
    refetch: refetchStats
  } = useStaffStats(staffRelationId, userId || null);
  
  // Function to refresh all data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Clear staff cache to ensure fresh data
      await clearStaffCache();
      // Refetch all data
      await Promise.all([
        refetchStaffData(),
        refetchStats()
      ]);
      toast({
        title: "Dashboard Refreshed",
        description: "All data has been updated from the server."
      });
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not refresh data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Combined loading state
  const isLoading = staffStatusLoading || authLoading || staffLoading || sessionLoading || statsLoading;

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Staff Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your staff dashboard. Manage your bookings and track your work.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="mt-4 sm:mt-0"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {/* Work Status Section */}
      {permissions.can_track_hours && (
        <WorkDaySection 
          activeWorkSession={activeWorkSession}
          onStartWorkDay={startWorkDay}
          onEndWorkDay={endWorkDay}
          onCreateJobCard={() => {}}
        />
      )}
      
      {/* Stats Cards - Only showing Hours Worked and if permission allows, Active Bookings */}
      <StaffStats stats={stats} permissions={permissions} />
      
      {/* Bookings Widget - Only show if user has booking permissions */}
      {(permissions.can_manage_bookings || permissions.can_view_customer_bookings) && (
        <BookingsWidget />
      )}
      
      {/* Work History Section - Only show if user can track hours */}
      {permissions.can_track_hours && staffRelationId && (
        <WorkHistorySection staffRelationId={staffRelationId} />
      )}
      
      {/* Permissions Card */}
      <PermissionsCard permissions={permissions} />
    </div>
  );
};

export default StaffDashboard;
