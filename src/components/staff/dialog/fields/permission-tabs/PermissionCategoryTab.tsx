
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "../../StaffFormSchema";
import PermissionToggle from "../PermissionToggle";
import { 
  List, 
  MessageSquare, 
  CalendarCheck, 
  Clock, 
  CreditCard, 
  BarChart4, 
  DollarSign,
  UserCog,
  Users
} from "lucide-react";

interface PermissionCategoryTabProps {
  form: UseFormReturn<StaffFormValues>;
  category: "tasks" | "communication" | "business";
}

const PermissionCategoryTab: React.FC<PermissionCategoryTabProps> = ({ 
  form, 
  category 
}) => {
  // Define permissions based on category
  const renderPermissions = () => {
    switch (category) {
      case "tasks":
        return (
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
        );
        
      case "communication":
        return (
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
            
            <PermissionToggle
              form={form}
              name="permissions.can_view_customer_bookings"
              label="View Customer Bookings"
              description="Can view booking details"
              icon={Users}
            />
          </div>
        );
        
      case "business":
        return (
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
            
            <PermissionToggle
              form={form}
              name="permissions.can_edit_profile"
              label="Edit Profile"
              description="Can edit their own profile"
              icon={UserCog}
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {renderPermissions()}
    </div>
  );
};

export default PermissionCategoryTab;
