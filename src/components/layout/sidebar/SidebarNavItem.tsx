
import React from "react";
import { Link } from "react-router-dom";
import { NavItemType } from "./sidebarNavConfig";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarNavItemProps {
  item: NavItemType;
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
  onClick,
}) => {
  const { label, path, icon: Icon, badge } = item;
  
  // Handle click for mobile navigation
  const handleClick = () => {
    onClick(path);
  };

  // Base classes
  const itemClasses = cn(
    "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
    isActive
      ? "bg-primary/10 font-medium text-primary"
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
    {
      "justify-center": isCollapsed,
    }
  );

  // For collapsed sidebar, show tooltip with label
  if (isCollapsed && !isMobile) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={`/dashboard/${path}`}
              onClick={handleClick}
              className={itemClasses}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" />
              {badge !== undefined && badge > 0 && (
                <Badge variant="secondary" className="ml-auto px-1 min-w-5 h-5">
                  {badge}
                </Badge>
              )}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-4">
            {label}
            {badge !== undefined && badge > 0 && (
              <Badge variant="secondary" className="px-1 min-w-5 h-5">
                {badge}
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Regular sidebar item
  return (
    <Link
      to={`/dashboard/${path}`}
      onClick={handleClick}
      className={itemClasses}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className={cn("h-5 w-5", isCollapsed ? "" : "mr-2")} />
      {!isCollapsed && (
        <>
          <span>{label}</span>
          {badge !== undefined && badge > 0 && (
            <Badge variant="secondary" className="ml-auto px-1 min-w-5 h-5">
              {badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  );
};

export default SidebarNavItem;
