
import React from "react";
import BusinessSubscribeButton from "./BusinessSubscribeButton";
import { cn } from "@/lib/utils";

interface FloatingSubscribeButtonProps {
  businessId: string;
  visible: boolean;
  showButton: boolean;
  isAuthenticated: boolean | null;
  onAuthRequired: () => boolean;
  buttonStyle?: React.CSSProperties;
  size?: "sm" | "default" | "lg";
}

const FloatingSubscribeButton: React.FC<FloatingSubscribeButtonProps> = ({
  businessId,
  visible,
  showButton,
  isAuthenticated,
  onAuthRequired,
  buttonStyle,
  size = "default"
}) => {
  if (!showButton) return null;

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 transition-all duration-300 transform",
      visible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
    )}>
      <BusinessSubscribeButton 
        businessId={businessId}
        customText="Subscribe"
        buttonStyle={buttonStyle}
        size={size}
        className="shadow-lg hover:scale-105 transition-transform"
        onAuthRequired={onAuthRequired}
      />
    </div>
  );
};

export default FloatingSubscribeButton;
