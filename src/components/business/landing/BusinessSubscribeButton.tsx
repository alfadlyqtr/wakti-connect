
import React from "react";
import { Button } from "@/components/ui/button";
import { useBusinessSubscribers } from "@/hooks/useBusinessSubscribers";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useCustomButtonStyle } from "@/hooks/useCustomButtonStyle";
import SubscribeButtonContent from "./SubscribeButtonContent";

interface BusinessSubscribeButtonProps {
  businessId: string;
  customText?: string;
  buttonStyle?: React.CSSProperties;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "gradient" | "minimal" | "secondary" | "link" | "destructive" | "ghost";
  iconOnly?: boolean;
  className?: string;
  onAuthRequired?: () => void;
  isAuthenticated?: boolean | null;
  // Detailed customization options
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  hoverColor?: string;
  hoverTextColor?: string;
  hoverBorderColor?: string;
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  boxShadow?: "none" | "sm" | "md" | "lg";
  iconPosition?: "left" | "right" | "none";
  paddingX?: string;
  paddingY?: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: "to-r" | "to-l" | "to-t" | "to-b" | "to-tr" | "to-tl" | "to-br" | "to-bl";
  showAuthAlert?: boolean;
}

const BusinessSubscribeButton: React.FC<BusinessSubscribeButtonProps> = ({
  businessId,
  customText = "Subscribe",
  buttonStyle,
  size = "default",
  variant = "default",
  iconOnly = false,
  className,
  onAuthRequired,
  isAuthenticated: propIsAuthenticated,
  // Detailed customization options
  backgroundColor,
  textColor,
  borderRadius,
  borderColor,
  borderWidth,
  hoverColor,
  hoverTextColor,
  hoverBorderColor,
  fontWeight = "medium",
  boxShadow = "none",
  iconPosition = "left",
  paddingX,
  paddingY,
  gradientFrom,
  gradientTo,
  gradientDirection = "to-r",
  showAuthAlert = true
}) => {
  const { 
    isSubscribed, 
    checkingSubscription, 
    subscribe, 
    unsubscribe
  } = useBusinessSubscribers(businessId);
  
  // Check authentication using the custom hook if not provided as prop
  const hookIsAuthenticated = useAuthentication();
  const isAuthenticated = propIsAuthenticated !== undefined ? propIsAuthenticated : hookIsAuthenticated;
  
  console.log("BusinessSubscribeButton:", { businessId, isAuthenticated, isSubscribed, customText });
  
  // Get custom button styles
  const { customButtonStyle, customVarsClass } = useCustomButtonStyle({
    backgroundColor,
    textColor,
    borderRadius,
    borderColor,
    borderWidth,
    hoverColor,
    hoverTextColor,
    hoverBorderColor,
    fontWeight,
    paddingX,
    paddingY,
    gradientFrom,
    gradientTo,
    gradientDirection,
    variant,
    buttonStyle
  });
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Check if authentication is required
    if (!isAuthenticated && onAuthRequired) {
      onAuthRequired();
      return;
    }
    
    if (isSubscribed) {
      unsubscribe.mutate();
    } else {
      subscribe.mutate();
    }
  };
  
  // Determine the button variant to use with shadcn
  const getButtonVariant = () => {
    if (variant === 'gradient') return 'default';
    return isSubscribed ? "outline" : variant;
  };
  
  if (checkingSubscription) {
    return (
      <Button 
        variant="outline" 
        size={size}
        disabled 
        className={cn("min-w-[120px]", className)}
        style={customButtonStyle}
      >
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        {!iconOnly && "Loading..."}
      </Button>
    );
  }
  
  return (
    <Button
      variant={getButtonVariant() as any}
      size={size}
      className={cn(
        isSubscribed ? "bg-muted/20" : "",
        "transition-all",
        customVarsClass,
        className
      )}
      style={customButtonStyle}
      onClick={handleClick}
      disabled={subscribe.isPending || unsubscribe.isPending}
    >
      <SubscribeButtonContent 
        isLoading={checkingSubscription}
        isPending={subscribe.isPending || unsubscribe.isPending}
        isSubscribed={isSubscribed}
        iconOnly={iconOnly}
        iconPosition={iconPosition}
        customText={customText}
      />
    </Button>
  );
};

export default BusinessSubscribeButton;
