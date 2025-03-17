
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
      variant={isActive ? "default" : "ghost"}
      size={isMobile || isCollapsed ? "icon" : "default"}
      asChild
      className={cn(
        "justify-start w-full",
        (isMobile || isCollapsed) && "h-10 w-10 flex items-center justify-center",
        isActive && "bg-wakti-blue text-white hover:bg-wakti-blue/90"
      )}
      onClick={() => onClick(item.path)}
    >
      <Link to={`/dashboard/${item.path}`} className="flex items-center justify-center w-full">
        <Icon className={cn("h-4 w-4", !isCollapsed && !isMobile && "mr-2")} />
        {!isMobile && !isCollapsed && (
          <span className="text-sm">{item.label}</span>
        )}
        {item.badge && !isMobile && !isCollapsed && (
          <Badge variant="secondary" className="ml-auto text-xs h-5 min-w-5 flex items-center justify-center">
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
            <div className="flex items-center gap-2">
              <p>{item.label}</p>
              {item.badge && (
                <Badge variant="secondary" className="text-xs h-5 min-w-5 flex items-center justify-center">
                  {item.badge}
                </Badge>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return buttonContent;
};

export default SidebarNavItem;
