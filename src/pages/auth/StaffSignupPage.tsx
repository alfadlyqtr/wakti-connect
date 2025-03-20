
import React from "react";
import StaffSignupForm from "@/components/auth/StaffSignupForm";
import { useTheme } from "next-themes";

const StaffSignupPage = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-6 left-6">
        <img 
          src={theme === "dark" ? "/logo-white.png" : "/logo.png"} 
          alt="WAKTI Logo" 
          className="h-8" 
        />
      </div>
      
      <StaffSignupForm />
    </div>
  );
};

export default StaffSignupPage;
