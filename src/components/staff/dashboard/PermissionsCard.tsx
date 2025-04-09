
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

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
  can_view_analytics: "View Analytics"
};

const PermissionsCard: React.FC<PermissionsProps> = ({ permissions = {} }) => {
  // Get active permissions only, using only those with labels and true values
  const activePermissions = Object.entries(permissions || {})
    .filter(([key, value]) => key in permissionLabels && value === true)
    .sort((a, b) => permissionLabels[a[0]].localeCompare(permissionLabels[b[0]]));
    
  if (activePermissions.length === 0) {
    return null; // Don't show the card if no active permissions are available
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Permissions</CardTitle>
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
