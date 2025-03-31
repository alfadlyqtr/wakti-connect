
import React from "react";
import { Button } from "@/components/ui/button";
import { useBusinessSubscribers } from "@/hooks/useBusinessSubscribers";
import { Loader2, Heart, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessSubscribeButtonProps {
  businessId: string;
  customText?: string;
  buttonStyle?: React.CSSProperties;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "gradient";
  iconOnly?: boolean;
  className?: string;
  onAuthRequired?: () => boolean;
  // Additional customization options
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  hoverColor?: string;
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
  backgroundColor,
  textColor,
  borderRadius,
  borderColor,
  borderWidth,
  hoverColor
}) => {
  const { 
    isSubscribed, 
    checkingSubscription, 
    subscribe, 
    unsubscribe 
  } = useBusinessSubscribers(businessId);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Check if authentication is required and the function returns false
    if (onAuthRequired && !onAuthRequired()) {
      return;
    }
    
    if (isSubscribed) {
      unsubscribe.mutate();
    } else {
      subscribe.mutate();
    }
  };
  
  // Custom styles based on props
  const customButtonStyle: React.CSSProperties = {
    ...(buttonStyle || {}),
    ...(backgroundColor ? { backgroundColor } : {}),
    ...(textColor ? { color: textColor } : {}),
    ...(borderRadius ? { borderRadius } : {}),
    ...(borderColor ? { borderColor } : {}),
    ...(borderWidth ? { borderWidth } : {}),
    transition: 'all 0.2s ease'
  };
  
  // Custom hover styles
  const getHoverStyles = () => {
    if (hoverColor) {
      return `hover:bg-opacity-90 ${isSubscribed ? '' : 'hover:shadow-md'}`;
    }
    return isSubscribed ? '' : 'hover:shadow-md';
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
      variant={variant === "gradient" ? "default" : (isSubscribed ? "outline" : variant)}
      size={size}
      className={cn(
        isSubscribed ? "bg-muted/20" : "",
        "transition-all",
        getHoverStyles(),
        className
      )}
      style={customButtonStyle}
      onClick={handleClick}
      disabled={subscribe.isPending || unsubscribe.isPending}
    >
      {subscribe.isPending || unsubscribe.isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {!iconOnly && (isSubscribed ? " Unsubscribing..." : " Subscribing...")}
        </>
      ) : (
        <>
          {isSubscribed ? (
            <>
              {iconOnly ? <BellOff className="h-4 w-4" /> : <BellOff className="h-4 w-4 mr-2" />}
              {!iconOnly && "Unsubscribe"}
            </>
          ) : (
            <>
              {iconOnly ? <Heart className="h-4 w-4" /> : <Heart className="h-4 w-4 mr-2" />}
              {!iconOnly && customText}
            </>
          )}
        </>
      )}
    </Button>
  );
};

export default BusinessSubscribeButton;
