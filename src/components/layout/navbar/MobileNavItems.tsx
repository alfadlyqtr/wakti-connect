import React from "react";
import { Link } from "react-router-dom";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

// This component is no longer directly used in its original form,
// but keeping it for backward compatibility.
// The functionality has been integrated directly into UserMenu.tsx

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge: number | null;
  showForBusiness?: boolean;
  hideForStaff?: boolean;
}

interface MobileNavItemsProps {
  filteredNavItems: NavItem[];
}

const MobileNavItems = ({ filteredNavItems }: MobileNavItemsProps) => {
  if (filteredNavItems.length === 0) {
    return null;
  }

  return (
    <>
      {filteredNavItems.map((item, index) => (
        <DropdownMenuItem key={index} asChild>
          <Link to={item.path} className="flex items-center">
            <item.icon className="h-4 w-4 mr-2" />
            {item.label}
            {item.badge && (
              <span className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {item.badge > 9 ? '9+' : item.badge}
              </span>
            )}
          </Link>
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
    </>
  );
};

export default MobileNavItems;
