
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NavItem } from "./sidebarNavConfig";

interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  isMobile: boolean;
  onClick: (path: string) => void;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  isActive,
  isMobile,
  onClick
}) => {
  const Icon = item.icon;
  
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      size={isMobile ? "icon" : "default"}
      asChild
      className={cn(
        "justify-start",
        isMobile && "h-12 w-12"
      )}
      onClick={() => onClick(item.path)}
    >
      <Link to={`/dashboard/${item.path}`}>
        <Icon className="h-5 w-5" />
        {!isMobile && (
          <span className="ml-2">{item.label}</span>
        )}
        {item.badge && !isMobile && (
          <Badge variant="secondary" className="ml-auto">
            {item.badge}
          </Badge>
        )}
      </Link>
    </Button>
  );
};

export default SidebarNavItem;
