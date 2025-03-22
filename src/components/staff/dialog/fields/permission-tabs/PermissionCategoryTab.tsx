
import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PermissionCategoryTabProps {
  icon: LucideIcon;
  title: string;
  isActive: boolean;
  onClick: () => void;
  children?: ReactNode;
}

const PermissionCategoryTab: React.FC<PermissionCategoryTabProps> = ({
  icon: Icon,
  title,
  isActive,
  onClick,
  children,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      )}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      <span>{title}</span>
      {children}
    </div>
  );
};

export default PermissionCategoryTab;
