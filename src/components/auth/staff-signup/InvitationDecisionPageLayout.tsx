
import React, { ReactNode } from "react";
import { useTheme } from "next-themes";

interface InvitationDecisionPageLayoutProps {
  children: ReactNode;
}

const InvitationDecisionPageLayout: React.FC<InvitationDecisionPageLayoutProps> = ({ 
  children 
}) => {
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
      
      {children}
    </div>
  );
};

export default InvitationDecisionPageLayout;
