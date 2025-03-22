
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "../StaffFormSchema";
import { List, MessageSquare, CalendarCheck, Clock, CreditCard, BarChart4, DollarSign } from "lucide-react";
import PermissionToggle from "./PermissionToggle";

interface PermissionGroupsProps {
  form: UseFormReturn<StaffFormValues>;
}

const PermissionGroups: React.FC<PermissionGroupsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <List className="h-5 w-5 text-muted-foreground" />
        <h4 className="text-lg font-medium">Staff Permissions</h4>
      </div>
      
      {/* Tasks Permissions */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-muted-foreground">Tasks</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </div>
      
      {/* Communication & Bookings */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-muted-foreground">Communication & Bookings</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </div>
      
      {/* Work & Hours */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-muted-foreground">Work & Earnings</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      
      {/* Job Cards & Analytics */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-muted-foreground">Job Cards & Analytics</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </div>
    </div>
  );
};

export default PermissionGroups;
