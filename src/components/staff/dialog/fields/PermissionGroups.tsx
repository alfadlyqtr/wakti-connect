
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "../StaffFormSchema";
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
import { Separator } from "@/components/ui/separator";
import PermissionToggle from "./PermissionToggle";

interface PermissionGroupsProps {
  form: UseFormReturn<StaffFormValues>;
}

const PermissionGroups: React.FC<PermissionGroupsProps> = ({ form }) => {
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
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <List className="h-4 w-4 text-primary" />
          <h5 className="text-sm font-medium">Tasks & Work Management</h5>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2">
          <PermissionToggle
            form={form}
            name="permissions.can_view_tasks"
            label="View Tasks"
            description="Can view assigned tasks"
            icon={List}
          />
          
          <PermissionToggle
            form={form}
            name="permissions.can_manage_tasks"
            label="Manage Tasks"
            description="Can create, edit, and delete tasks"
            icon={List}
          />
          
          <PermissionToggle
            form={form}
            name="permissions.can_track_hours"
            label="Track Hours"
            description="Can track working hours"
            icon={Clock}
          />
          
          <PermissionToggle
            form={form}
            name="permissions.can_log_earnings"
            label="Log Earnings"
            description="Can log daily earnings"
            icon={DollarSign}
          />
        </div>
      </div>
      
      <Separator />
      
      {/* Communication & Bookings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h5 className="text-sm font-medium">Communication & Bookings</h5>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2">
          <PermissionToggle
            form={form}
            name="permissions.can_message_staff"
            label="Message Staff"
            description="Can message other staff members"
            icon={MessageSquare}
          />
          
          <PermissionToggle
            form={form}
            name="permissions.can_manage_bookings"
            label="Manage Bookings"
            description="Can manage customer bookings"
            icon={CalendarCheck}
          />
          
          <PermissionToggle
            form={form}
            name="permissions.can_view_customer_bookings"
            label="View Customer Bookings"
            description="Can view booking details"
            icon={Users}
          />
        </div>
      </div>
      
      <Separator />
      
      {/* Business Data & Analytics */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart4 className="h-4 w-4 text-primary" />
          <h5 className="text-sm font-medium">Business Data & Analytics</h5>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2">
          <PermissionToggle
            form={form}
            name="permissions.can_create_job_cards"
            label="Create Job Cards"
            description="Can create and close job cards"
            icon={CreditCard}
          />
          
          <PermissionToggle
            form={form}
            name="permissions.can_view_analytics"
            label="View Analytics"
            description="Can view business analytics"
            icon={BarChart4}
          />
          
          <PermissionToggle
            form={form}
            name="permissions.can_edit_profile"
            label="Edit Profile"
            description="Can edit their own profile"
            icon={UserCog}
          />
        </div>
      </div>
    </div>
  );
};

export default PermissionGroups;
