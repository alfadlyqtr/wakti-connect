
import React from "react";
import { Link } from "react-router-dom";

interface PoweredByWAKTIProps {
  position: "top" | "bottom";
}

const PoweredByWAKTI: React.FC<PoweredByWAKTIProps> = ({ position }) => {
  return (
    <div 
      className={`w-full py-2 px-4 text-center text-xs bg-black/5 backdrop-blur-sm ${
        position === "bottom" 
          ? "border-t border-gray-200" 
          : "border-b border-gray-200"
      }`}
    >
      <span className="text-gray-600">
        Powered by{" "}
        <Link 
          to="/"
          className="font-semibold text-primary hover:underline inline-flex items-center"
        >
          WAKTI
        </Link>
      </span>
    </div>
  );
};

export default PoweredByWAKTI;
