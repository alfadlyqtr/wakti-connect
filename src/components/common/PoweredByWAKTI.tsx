
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PoweredByWAKTIProps {
  variant?: "default" | "colored" | "minimal";
  className?: string;
}

const PoweredByWAKTI: React.FC<PoweredByWAKTIProps> = ({ 
  variant = "default",
  className
}) => {
  return (
    <div 
      className={cn(
        "w-full py-2 px-4 text-center text-xs",
        variant === "colored" ? "bg-primary/10" : "bg-black/5 backdrop-blur-sm",
        variant === "minimal" ? "border-t border-gray-200/50" : "border-t border-gray-200",
        className
      )}
    >
      <span className={cn(
        variant === "colored" ? "text-primary" : "text-gray-600"
      )}>
        Powered by{" "}
        <Link 
          to="/"
          className={cn(
            "font-semibold hover:underline inline-flex items-center",
            variant === "colored" ? "text-primary" : "text-primary"
          )}
        >
          WAKTI
        </Link>
      </span>
    </div>
  );
};

export default PoweredByWAKTI;
