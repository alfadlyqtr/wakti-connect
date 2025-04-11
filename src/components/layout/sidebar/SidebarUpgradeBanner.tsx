
import React from "react";
import { NavLink } from "react-router-dom";
import { Crown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SidebarUpgradeBanner: React.FC = () => {
  return (
    <div className="px-4 py-6 mt-auto">
      <div className="p-4 rounded-lg bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA] text-white">
        <div className="flex items-center gap-2 mb-2">
          <Crown size={18} />
          <h3 className="font-semibold">Upgrade Now</h3>
        </div>
        <p className="text-sm opacity-90 mb-3">
          Unlock the power of WAKTI by upgrading your individual plan.
        </p>
        <Button 
          size="sm" 
          className="w-full bg-white hover:bg-white/90 text-[#9b87f5] flex items-center justify-center gap-1.5"
          asChild
        >
          <NavLink to="/dashboard/settings">
            Upgrade Plan
            <ArrowUpRight className="h-4 w-4" />
          </NavLink>
        </Button>
      </div>
    </div>
  );
};

export default SidebarUpgradeBanner;
