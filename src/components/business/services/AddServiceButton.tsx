
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AddServiceButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

const AddServiceButton: React.FC<AddServiceButtonProps> = ({ 
  onClick, 
  isLoading = false 
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="w-full md:w-auto"
    >
      <PlusCircle className="mr-2 h-4 w-4" />
      Add Service
    </Button>
  );
};

export default AddServiceButton;
