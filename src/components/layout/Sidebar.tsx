
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SidebarNavItems } from "./sidebar/SidebarNavItems"; // Changed from default import to named import
import SidebarUpgradeBanner from "./sidebar/SidebarUpgradeBanner";

interface SidebarProps {
  isOpen: boolean;
  userRole?: "free" | "individual" | "business";
}

const Sidebar = ({ isOpen, userRole = "free" }: SidebarProps) => {
  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 w-64 bg-sidebar z-40 border-r border-border transition-transform duration-300 ease-in-out transform",
        {
          "translate-x-0": isOpen,
          "-translate-x-full": !isOpen,
        },
        "lg:translate-x-0" // Always visible on large screens
      )}
    >
      <div className="h-full flex flex-col">
        <div className="px-6 py-6">
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <span>Wakti</span>
            {userRole === "free" && (
              <Badge variant="outline" className="text-xs bg-wakti-gold/10 text-wakti-gold">
                Free
              </Badge>
            )}
            {userRole === "individual" && (
              <Badge variant="outline" className="text-xs bg-wakti-blue/10 text-wakti-blue">
                Individual
              </Badge>
            )}
            {userRole === "business" && (
              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500">
                Business
              </Badge>
            )}
          </h2>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <SidebarNavItems userRole={userRole} />
        </nav>
        
        {userRole === "free" && <SidebarUpgradeBanner />}
      </div>
    </aside>
  );
};

export default Sidebar;
