
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CollapseToggleProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

const CollapseToggle: React.FC<CollapseToggleProps> = ({ collapsed, toggleCollapse }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute -right-3 top-2 h-6 w-6 rounded-full border bg-background shadow-md hidden lg:flex items-center justify-center"
      onClick={toggleCollapse}
    >
      {collapsed ? (
        <ChevronRight className="h-3 w-3" />
      ) : (
        <ChevronLeft className="h-3 w-3" />
      )}
    </Button>
  );
};

export default CollapseToggle;
