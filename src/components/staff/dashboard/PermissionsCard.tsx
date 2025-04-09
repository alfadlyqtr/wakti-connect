
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearStaffCache, getStaffPermissions } from "@/utils/staffUtils";
import { useToast } from "@/hooks/use-toast";

interface PermissionsProps {
  permissions: Record<string, boolean>;
}

const permissionLabels: Record<string, string> = {
  can_view_tasks: "View Tasks",
  can_manage_tasks: "Manage Tasks",
  can_message_staff: "Message Staff",
  can_manage_bookings: "Manage Bookings",
  can_create_job_cards: "Create Job Cards",
  can_track_hours: "Track Hours",
  can_log_earnings: "Log Earnings",
  can_edit_profile: "Edit Profile",
  can_view_customer_bookings: "View Customer Bookings",
  can_view_analytics: "View Analytics",
  can_message_customers: "Message Customers"
};

const PermissionsCard: React.FC<PermissionsProps> = ({ permissions = {} }) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localPermissions, setLocalPermissions] = useState<Record<string, boolean>>(permissions);
  
  // Get active permissions only, using only those with labels and true values
  const activePermissions = Object.entries(localPermissions || {})
    .filter(([key, value]) => key in permissionLabels && value === true)
    .sort((a, b) => permissionLabels[a[0]].localeCompare(permissionLabels[b[0]]));
  
  // Function to refresh permissions from the server
  const refreshPermissions = async () => {
    setIsRefreshing(true);
    try {
      await clearStaffCache();
      const refreshedPermissions = getStaffPermissions();
      setLocalPermissions(refreshedPermissions);
      toast({
        title: "Permissions Refreshed",
        description: "Your permissions have been updated from the server."
      });
    } catch (error) {
      console.error("Error refreshing permissions:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not refresh permissions. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    setLocalPermissions(permissions);
  }, [permissions]);
  
  if (activePermissions.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Permissions</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshPermissions}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No active permissions found. If this is incorrect, click refresh.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Permissions</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={refreshPermissions}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {activePermissions.map(([key]) => (
            <div key={key} className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-medium">
                {permissionLabels[key] || key}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionsCard;
