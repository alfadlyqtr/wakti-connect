
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface StaffHeaderProps {
  onRefresh: () => void;
}

const StaffHeader: React.FC<StaffHeaderProps> = ({ onRefresh }) => {
  return (
    <div className="flex justify-end mb-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        className="gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
    </div>
  );
};

export default StaffHeader;
