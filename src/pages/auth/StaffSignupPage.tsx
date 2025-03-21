
import React from "react";
import StaffSignupForm from "@/components/auth/StaffSignupForm";
import { useTheme } from "next-themes";
import { useSearchParams } from "react-router-dom";

const StaffSignupPage = () => {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const businessSlug = searchParams.get("business");
  const businessName = businessSlug ? businessSlug.replace(/-/g, ' ') : "Staff";
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-6 left-6">
        <img 
          src={theme === "dark" ? "/logo-white.png" : "/logo.png"} 
          alt="WAKTI Logo" 
          className="h-8" 
        />
      </div>
      
      <div className="w-full max-w-md">
        <h1 className="text-center text-lg font-medium mb-6 text-muted-foreground">
          {businessName ? `Join ${businessName}` : "Staff Account Setup"}
        </h1>
        <StaffSignupForm />
      </div>
    </div>
  );
};

export default StaffSignupPage;
