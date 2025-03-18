
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface MobileNavItemsProps {
  filteredNavItems: Array<{
    icon: React.ElementType;
    label: string;
    path: string;
    badge: number | null;
    showForBusiness?: boolean;
  }>;
}

const MobileNavItems = ({ filteredNavItems }: MobileNavItemsProps) => {
  return (
    <>
      {filteredNavItems.map((item, index) => (
        <DropdownMenuItem key={`mobile-${index}`} asChild>
          <Link to={item.path} className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
            </div>
            {item.badge && (
              <Badge variant="destructive" className="ml-2">
                {item.badge}
              </Badge>
            )}
          </Link>
        </DropdownMenuItem>
      ))}
    </>
  );
};

export default MobileNavItems;
