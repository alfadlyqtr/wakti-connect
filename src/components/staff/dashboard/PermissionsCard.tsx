
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

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
  // Get permissions for display, using only those with labels
  const displayPermissions = Object.entries(permissions || {})
    .filter(([key]) => key in permissionLabels)
    .sort((a, b) => permissionLabels[a[0]].localeCompare(permissionLabels[b[0]]));
    
  if (displayPermissions.length === 0) {
    return null; // Don't show the card if no permissions are available
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Permissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {displayPermissions.map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              {value ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-gray-400" />
              )}
              <span className={value ? "font-medium" : "text-muted-foreground"}>
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
