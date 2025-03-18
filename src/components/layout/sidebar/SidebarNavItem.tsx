
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
      size={isMobile || isCollapsed ? "icon" : "sm"}
      asChild
      className={cn(
        "w-full",
        (isMobile || isCollapsed) ? "h-9 w-9 p-0" : "h-9 justify-start px-3",
        isActive && "bg-wakti-blue text-white hover:bg-wakti-blue/90"
      )}
      onClick={() => onClick(item.path)}
    >
      <Link 
        to={`/dashboard/${item.path}`} 
        className={cn(
          "flex items-center gap-2.5",
          !isCollapsed && !isMobile && "w-full"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!isMobile && !isCollapsed && (
          <span className="text-xs truncate">{item.label}</span>
        )}
        {item.badge && !isMobile && !isCollapsed && (
          <Badge 
            variant="secondary" 
            className="ml-auto text-[10px] h-4 min-w-4 flex items-center justify-center"
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    </Button>
  );
  
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
                <Badge 
                  variant="secondary" 
                  className="text-xs h-5 min-w-5 flex items-center justify-center"
                >
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
