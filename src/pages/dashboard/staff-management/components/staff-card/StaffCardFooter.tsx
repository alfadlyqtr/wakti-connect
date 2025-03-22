
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface StaffCardFooterProps {
  onViewDetails: () => void;
}

const StaffCardFooter: React.FC<StaffCardFooterProps> = ({ onViewDetails }) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="w-full"
      onClick={onViewDetails}
    >
      <Eye className="h-3.5 w-3.5 mr-1" />
      View Details
    </Button>
  );
};

export default StaffCardFooter;
