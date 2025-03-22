
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { EditStaffFormValues } from "../hooks/useStaffDetailsForm";
import { Separator } from "@/components/ui/separator";
import { 
  List, 
  MessageSquare, 
  CalendarCheck, 
  Clock, 
  CreditCard, 
  BarChart4, 
  DollarSign,
  ShieldCheck,
  UserCog,
  Users
} from "lucide-react";
import PermissionSection from "../permissions/PermissionSection";

interface PermissionsTabProps {
  form: UseFormReturn<EditStaffFormValues>;
}

export const PermissionsTab: React.FC<PermissionsTabProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <ShieldCheck className="h-5 w-5 text-muted-foreground" />
        <h4 className="text-lg font-medium">Staff Permissions</h4>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-lg border border-muted">
        <p className="text-sm text-muted-foreground mb-4">
          Configure what this staff member can access and do within your business account. 
          Enabled permissions will appear with a green highlight.
        </p>
      </div>
      
      {/* Tasks Permissions */}
      <div className="space-y-3">
        <h5 className="font-medium flex items-center gap-2">
          <List className="h-4 w-4" />
          Tasks & Work Management
        </h5>
        <PermissionSection 
          form={form}
          title="View Tasks" 
          description="Can view assigned tasks"
          name="permissions.can_view_tasks"
        />
        <PermissionSection 
          form={form}
          title="Manage Tasks" 
          description="Can create, edit, and delete tasks"
          name="permissions.can_manage_tasks"
        />
        <PermissionSection 
          form={form}
          title="Track Hours" 
          description="Can track working hours"
          name="permissions.can_track_hours"
        />
        <PermissionSection 
          form={form}
          title="Log Earnings" 
          description="Can log daily earnings"
          name="permissions.can_log_earnings"
        />
      </div>
      
      <Separator />
      
      {/* Communication & Bookings */}
      <div className="space-y-3">
        <h5 className="font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Communication & Bookings
        </h5>
        <PermissionSection 
          form={form}
          title="Message Staff" 
          description="Can message other staff members"
          name="permissions.can_message_staff"
        />
        <PermissionSection 
          form={form}
          title="Manage Bookings" 
          description="Can manage customer bookings"
          name="permissions.can_manage_bookings"
        />
        <PermissionSection 
          form={form}
          title="View Customer Bookings" 
          description="Can view booking details"
          name="permissions.can_view_customer_bookings"
        />
      </div>
      
      <Separator />
      
      {/* Business Data & Analytics */}
      <div className="space-y-3">
        <h5 className="font-medium flex items-center gap-2">
          <BarChart4 className="h-4 w-4" />
          Business Data & Analytics
        </h5>
        <PermissionSection 
          form={form}
          title="Create Job Cards" 
          description="Can create and close job cards"
          name="permissions.can_create_job_cards"
        />
        <PermissionSection 
          form={form}
          title="View Analytics" 
          description="Can view business analytics"
          name="permissions.can_view_analytics"
        />
        <PermissionSection 
          form={form}
          title="Edit Profile" 
          description="Can edit their own profile"
          name="permissions.can_edit_profile"
        />
      </div>
    </div>
  );
};
