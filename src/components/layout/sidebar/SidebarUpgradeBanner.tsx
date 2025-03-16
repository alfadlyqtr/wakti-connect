
import React from "react";
import { NavLink } from "react-router-dom";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const SidebarUpgradeBanner: React.FC = () => {
  return (
    <div className="px-4 py-6 mt-auto">
      <div className="p-4 rounded-lg bg-gradient-to-r from-wakti-blue to-blue-600 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Crown size={18} />
          <h3 className="font-semibold">Upgrade Now</h3>
        </div>
        <p className="text-sm opacity-90 mb-3">
          Get full access to all features and unlock premium benefits.
        </p>
        <Button 
          size="sm" 
          className="w-full bg-white hover:bg-white/90 text-wakti-blue"
          asChild
        >
          <NavLink to="/dashboard/upgrade">
            Upgrade Plan
          </NavLink>
        </Button>
      </div>
    </div>
  );
};

export default SidebarUpgradeBanner;
