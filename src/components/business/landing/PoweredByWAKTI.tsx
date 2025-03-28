
import React from "react";
import { Link } from "react-router-dom";

interface PoweredByWAKTIProps {
  position?: "top" | "bottom";
}

const PoweredByWAKTI: React.FC<PoweredByWAKTIProps> = ({ position = "bottom" }) => {
  return (
    <div className={`w-full text-center py-2 ${position === "top" ? "bg-background/80 backdrop-blur-sm border-b border-border" : "border-t border-border mt-8"}`}>
      <Link 
        to="/" 
        className="text-xs text-muted-foreground hover:text-wakti-blue transition-colors inline-flex items-center"
      >
        Powered by <span className="font-bold ml-1">WAKTI</span>
      </Link>
    </div>
  );
};

export default PoweredByWAKTI;
