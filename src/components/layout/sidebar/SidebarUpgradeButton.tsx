
import React from "react";
import { NavLink } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarUpgradeButtonProps {
  collapsed: boolean;
}

const SidebarUpgradeButton: React.FC<SidebarUpgradeButtonProps> = ({ collapsed }) => {
  if (collapsed) {
    return (
      <NavLink to="/dashboard/settings" className="my-2 block px-3">
        <Button 
          size="icon"
          variant="outline"
          className="w-full bg-[#9b87f5] text-white hover:bg-[#9b87f5]/90 border-none"
          title="Upgrade Account"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </NavLink>
    );
  }
  
  return (
    <NavLink to="/dashboard/settings" className="my-2 block px-3">
      <Button 
        variant="outline"
        className="w-full bg-[#9b87f5] text-white hover:bg-[#9b87f5]/90 border-none flex items-center justify-center gap-1.5"
      >
        Upgrade Account
        <ArrowUpRight className="h-4 w-4" />
      </Button>
    </NavLink>
  );
};

export default SidebarUpgradeButton;
