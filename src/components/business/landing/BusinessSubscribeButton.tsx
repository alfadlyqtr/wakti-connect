
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
  variant?: "default" | "outline" | "gradient" | "minimal" | "secondary" | "link" | "destructive" | "ghost";
  iconOnly?: boolean;
  className?: string;
  onAuthRequired?: () => void; // Changed to void return type for simpler usage
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
  showAuthAlert?: boolean; // Whether to show auth alert automatically
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
    unsubscribe,
    isAuthenticated
  } = useBusinessSubscribers(businessId);
  
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
  
  // Generate a gradient background if variant is gradient
  const getGradientStyle = () => {
    if (variant !== 'gradient') return {};
    
    const fromColor = gradientFrom || '#3B82F6';
    const toColor = gradientTo || '#10B981';
    
    return {
      background: `linear-gradient(${gradientDirection === 'to-r' ? '90deg' : 
                                     gradientDirection === 'to-l' ? '270deg' : 
                                     gradientDirection === 'to-t' ? '0deg' : 
                                     gradientDirection === 'to-b' ? '180deg' : 
                                     gradientDirection === 'to-tr' ? '45deg' : 
                                     gradientDirection === 'to-tl' ? '315deg' : 
                                     gradientDirection === 'to-br' ? '135deg' : '225deg'}, 
                                     ${fromColor}, ${toColor})`
    };
  };
  
  // Custom styles based on props
  const customButtonStyle: React.CSSProperties = {
    ...(buttonStyle || {}),
    ...(backgroundColor && variant !== 'gradient' ? { backgroundColor } : {}),
    ...(variant === 'gradient' ? getGradientStyle() : {}),
    ...(textColor ? { color: textColor } : {}),
    ...(borderRadius ? { borderRadius } : {}),
    ...(borderColor ? { borderColor } : {}),
    ...(borderWidth ? { borderWidth } : {}),
    ...(fontWeight ? { fontWeight } : {}),
    ...(paddingX || paddingY ? { padding: `${paddingY || '8px'} ${paddingX || '16px'}` } : {}),
    transition: 'all 0.2s ease'
  };
  
  // Build CSS variables for hover effects that will be used in a custom class
  const customVarsClass = React.useMemo(() => {
    const randomId = Math.random().toString(36).substring(2, 10);
    const className = `custom-btn-${randomId}`;
    
    // Create a style element for the hover styles
    if (typeof document !== 'undefined' && (hoverColor || hoverTextColor || hoverBorderColor)) {
      const styleEl = document.createElement('style');
      styleEl.innerHTML = `
        .${className}:hover {
          ${hoverColor ? `background-color: ${hoverColor} !important;` : ''}
          ${hoverTextColor ? `color: ${hoverTextColor} !important;` : ''}
          ${hoverBorderColor ? `border-color: ${hoverBorderColor} !important;` : ''}
          transform: translateY(-1px);
          ${boxShadow !== 'none' ? `box-shadow: var(--shadow-${boxShadow});` : ''}
        }
      `;
      document.head.appendChild(styleEl);
    }
    
    return className;
  }, [hoverColor, hoverTextColor, hoverBorderColor, boxShadow]);
  
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
      {subscribe.isPending || unsubscribe.isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {!iconOnly && (isSubscribed ? " Unsubscribing..." : " Subscribing...")}
        </>
      ) : (
        <>
          {isSubscribed ? (
            <>
              {iconOnly ? 
                <BellOff className="h-4 w-4" /> : 
                (iconPosition === "left" ? <BellOff className="h-4 w-4 mr-2" /> : null)
              }
              {!iconOnly && "Unsubscribe"}
              {!iconOnly && iconPosition === "right" && <BellOff className="h-4 w-4 ml-2" />}
            </>
          ) : (
            <>
              {iconOnly ? 
                <Heart className="h-4 w-4" /> : 
                (iconPosition === "left" ? <Heart className="h-4 w-4 mr-2" /> : null)
              }
              {!iconOnly && customText}
              {!iconOnly && iconPosition === "right" && <Heart className="h-4 w-4 ml-2" />}
            </>
          )}
        </>
      )}
    </Button>
  );
};

export default BusinessSubscribeButton;
