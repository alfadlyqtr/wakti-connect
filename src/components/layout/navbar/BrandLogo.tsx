
import React from "react";
import { Link } from "react-router-dom";

const BrandLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img 
        src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" 
        alt="WAKTI Logo" 
        className="w-8 h-8 rounded-md object-cover"
      />
      <span className="font-bold text-lg hidden md:block">WAKTI</span>
    </Link>
  );
};

export default BrandLogo;
