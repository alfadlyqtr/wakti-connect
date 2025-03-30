
import React from "react";
import { Link } from "react-router-dom";

interface PoweredByWAKTIProps {
  position?: "top" | "bottom";
  variant?: "light" | "dark" | "colored";
  className?: string;
}

const PoweredByWAKTI: React.FC<PoweredByWAKTIProps> = ({ 
  position = "bottom",
  variant = "dark",
  className = ""
}) => {
  return (
    <div className={`w-full text-center py-2 ${position === "top" ? "border-b" : "border-t mt-4"} border-border ${className}`}>
      <Link 
        to="/" 
        className={`text-xs ${variant === "light" 
          ? "text-white/70 hover:text-white" 
          : variant === "colored" 
            ? "text-wakti-blue hover:text-wakti-blue/80" 
            : "text-muted-foreground hover:text-wakti-blue"
        } transition-colors inline-flex items-center`}
      >
        Powered by <span className="font-bold ml-1">WAKTI</span>
      </Link>
    </div>
  );
};

export default PoweredByWAKTI;
