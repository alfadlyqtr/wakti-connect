
import React from "react";
import { Separator } from "@/components/ui/separator";

interface SidebarSectionHeaderProps {
  title: string;
}

const SidebarSectionHeader: React.FC<SidebarSectionHeaderProps> = ({ title }) => {
  return (
    <div className="mt-6 mb-2">
      <Separator className="mb-2" />
      <p className="px-2 text-xs font-semibold text-muted-foreground">
        {title}
      </p>
    </div>
  );
};

export default SidebarSectionHeader;
