
import * as React from "react";
import { cn } from "@/lib/utils";

interface RibbonProps {
  text: string;
  className?: string;
}

export const Ribbon: React.FC<RibbonProps> = ({ text, className }) => {
  return (
    <div className={cn("absolute -right-2 -top-2 z-10", className)}>
      <div className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
        {text}
      </div>
    </div>
  );
};
