
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FreeAccountBanner: React.FC = () => {
  const navigate = useNavigate();
  
  const handleUpgradeClick = () => {
    navigate("/dashboard/settings");
  };
  
  return (
    <div className="w-full bg-[#D6BCFA] bg-opacity-80 text-gray-800 py-2.5 px-4 flex flex-col sm:flex-row items-center justify-between">
      <div className="font-medium mb-2 sm:mb-0 text-center sm:text-left">
        FREE ACCOUNT — Unlock the power of WAKTI by upgrading your plan
      </div>
      <Button 
        variant="outline" 
        className="bg-white hover:bg-white/90 border-purple-300 text-purple-900 flex items-center gap-1.5"
        onClick={handleUpgradeClick}
      >
        Upgrade Now
        <ArrowUpRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FreeAccountBanner;
