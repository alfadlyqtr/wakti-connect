
import React from "react";
import { LucideIcon } from "lucide-react";
import PermissionToggle from "../../fields/PermissionToggle";
import { UseFormReturn } from "react-hook-form";
import { EditStaffFormValues } from "../hooks/useStaffDetailsForm";

interface PermissionSectionProps {
  form: UseFormReturn<EditStaffFormValues>;
  title: string;
  icon: LucideIcon;
  permissions: Array<{
    name: string;
    label: string;
    description: string;
    icon: LucideIcon;
  }>;
}

const PermissionSection: React.FC<PermissionSectionProps> = ({
  form,
  title,
  icon: SectionIcon,
  permissions
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <SectionIcon className="h-4 w-4 text-primary" />
        <h5 className="text-sm font-medium">{title}</h5>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2">
        {permissions.map((permission) => (
          <PermissionToggle
            key={permission.name}
            form={form}
            name={`permissions.${permission.name}`}
            label={permission.label}
            description={permission.description}
            icon={permission.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default PermissionSection;
