
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { NavItem } from "./sidebarNavConfig";

interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  isMobile: boolean;
  isCollapsed?: boolean;
  onClick: (path: string) => void;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  isActive,
  isMobile,
  isCollapsed = false,
  onClick
}) => {
  const Icon = item.icon;
  
  const buttonContent = (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      size={isMobile || isCollapsed ? "icon" : "default"}
      asChild
      className={cn(
        "justify-start",
        (isMobile || isCollapsed) && "h-10 w-10"
      )}
      onClick={() => onClick(item.path)}
    >
      <Link to={`/dashboard/${item.path}`}>
        <Icon className="h-5 w-5" />
        {!isMobile && !isCollapsed && (
          <span className="ml-2">{item.label}</span>
        )}
        {item.badge && !isMobile && !isCollapsed && (
          <Badge variant="secondary" className="ml-auto">
            {item.badge}
          </Badge>
        )}
      </Link>
    </Button>
  );
  
  // When collapsed, wrap in tooltip
  if (isCollapsed && !isMobile) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.label}</p>
            {item.badge && (
              <Badge variant="secondary" className="ml-2">
                {item.badge}
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return buttonContent;
};

export default SidebarNavItem;
