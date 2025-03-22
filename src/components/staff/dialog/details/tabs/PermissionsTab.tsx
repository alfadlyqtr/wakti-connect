
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
      <PermissionSection 
        form={form}
        title="Tasks & Work Management"
        icon={List}
        permissions={[
          {
            name: "can_view_tasks",
            label: "View Tasks",
            description: "Can view assigned tasks",
            icon: List
          },
          {
            name: "can_manage_tasks",
            label: "Manage Tasks",
            description: "Can create, edit, and delete tasks",
            icon: List
          },
          {
            name: "can_track_hours",
            label: "Track Hours",
            description: "Can track working hours",
            icon: Clock
          },
          {
            name: "can_log_earnings",
            label: "Log Earnings",
            description: "Can log daily earnings",
            icon: DollarSign
          }
        ]}
      />
      
      <Separator />
      
      {/* Communication & Bookings */}
      <PermissionSection
        form={form}
        title="Communication & Bookings"
        icon={MessageSquare}
        permissions={[
          {
            name: "can_message_staff",
            label: "Message Staff",
            description: "Can message other staff members",
            icon: MessageSquare
          },
          {
            name: "can_manage_bookings",
            label: "Manage Bookings",
            description: "Can manage customer bookings",
            icon: CalendarCheck
          },
          {
            name: "can_view_customer_bookings",
            label: "View Customer Bookings",
            description: "Can view booking details",
            icon: Users
          }
        ]}
      />
      
      <Separator />
      
      {/* Business Data & Analytics */}
      <PermissionSection
        form={form}
        title="Business Data & Analytics"
        icon={BarChart4}
        permissions={[
          {
            name: "can_create_job_cards",
            label: "Create Job Cards",
            description: "Can create and close job cards",
            icon: CreditCard
          },
          {
            name: "can_view_analytics",
            label: "View Analytics",
            description: "Can view business analytics",
            icon: BarChart4
          },
          {
            name: "can_edit_profile",
            label: "Edit Profile",
            description: "Can edit their own profile",
            icon: UserCog
          }
        ]}
      />
    </div>
  );
};
