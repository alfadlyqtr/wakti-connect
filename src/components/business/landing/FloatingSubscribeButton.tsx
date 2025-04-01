
import React from "react";
import BusinessSubscribeButton from "./BusinessSubscribeButton";
import { cn } from "@/lib/utils";

interface FloatingSubscribeButtonProps {
  businessId: string;
  visible: boolean;
  showButton?: boolean;
  isAuthenticated: boolean | null;
  onAuthRequired: () => void;
  buttonStyle?: React.CSSProperties;
  size?: "sm" | "default" | "lg";
  // Enhanced customization props
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  hoverColor?: string;
  hoverTextColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  customText?: string;
  variant?: "default" | "outline" | "gradient" | "minimal";
  iconPosition?: "left" | "right" | "none";
  boxShadow?: "none" | "sm" | "md" | "lg";
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  borderColor?: string;
  borderWidth?: string;
  hoverBorderColor?: string;
  paddingX?: string;
  paddingY?: string;
  gradientDirection?: "to-r" | "to-l" | "to-t" | "to-b" | "to-tr" | "to-tl" | "to-br" | "to-bl";
}

const FloatingSubscribeButton: React.FC<FloatingSubscribeButtonProps> = ({
  businessId,
  visible,
  showButton = true,
  onAuthRequired,
  isAuthenticated,
  buttonStyle,
  size = "default",
  // Enhanced customization props
  backgroundColor,
  textColor,
  borderRadius,
  hoverColor,
  hoverTextColor,
  gradientFrom,
  gradientTo,
  customText = "Subscribe",
  variant = "gradient",
  iconPosition = "left",
  boxShadow = "md",
  fontWeight,
  borderColor,
  borderWidth,
  hoverBorderColor,
  paddingX,
  paddingY,
  gradientDirection
}) => {
  // Debug logs to understand why the button might not be showing
  console.log("FloatingSubscribeButton rendering:", {
    visible,
    showButton,
    businessId,
    customText,
    isAuthenticated
  });

  // Always return the button component (removed the conditional check)
  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 transition-all duration-300 transform",
      visible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
    )}>
      <BusinessSubscribeButton 
        businessId={businessId}
        customText={customText}
        buttonStyle={buttonStyle}
        size={size}
        className="shadow-lg hover:scale-105 transition-transform"
        onAuthRequired={onAuthRequired}
        backgroundColor={backgroundColor}
        textColor={textColor}
        borderRadius={borderRadius}
        hoverColor={hoverColor}
        hoverTextColor={hoverTextColor}
        gradientFrom={gradientFrom}
        gradientTo={gradientTo}
        variant={variant}
        iconPosition={iconPosition}
        boxShadow={boxShadow}
        fontWeight={fontWeight}
        borderColor={borderColor}
        borderWidth={borderWidth}
        hoverBorderColor={hoverBorderColor}
        paddingX={paddingX}
        paddingY={paddingY}
        gradientDirection={gradientDirection}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

export default FloatingSubscribeButton;
