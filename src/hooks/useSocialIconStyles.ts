
import { useMemo } from "react";
import { SocialIconStyle, SocialIconSize } from "@/types/business.types";

export interface SocialIconStyleProps {
  style?: SocialIconStyle;
  size?: SocialIconSize;
  platform: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  hoverColor?: string;
  borderColor?: string;
  borderWidth?: string;
  hoverBorderColor?: string;
  scale?: number;
}

export const useSocialIconStyles = ({ 
  style = "default", 
  size = "default", 
  platform,
  backgroundColor,
  textColor,
  borderRadius,
  hoverColor,
  borderColor,
  borderWidth = "1px",
  hoverBorderColor,
  scale = 1
}: SocialIconStyleProps) => {
  const platformColors: Record<string, string> = {
    facebook: "#1877F2",
    instagram: "#E4405F",
    twitter: "#1DA1F2",
    linkedin: "#0A66C2",
    youtube: "#FF0000",
    tiktok: "#000000",
    pinterest: "#BD081C",
    whatsapp: "#25D366",
    website: "#4285F4"
  };

  const iconSize = useMemo(() => {
    return size === "small" ? 
      { containerSize: "w-8 h-8", iconSize: "w-4 h-4" } : 
      size === "large" ? 
        { containerSize: "w-12 h-12", iconSize: "w-6 h-6" } : 
        { containerSize: "w-10 h-10", iconSize: "w-5 h-5" };
  }, [size]);

  const buttonStyles = useMemo(() => {
    const baseClasses = `flex items-center justify-center transition-all duration-200 ${iconSize.containerSize}`;
    const buttonColor = backgroundColor || platformColors[platform] || "#6E6E6E";
    const customBorderRadius = borderRadius || "9999px"; // Default to rounded-full
    
    const customStyle: Record<string, any> = {
      transform: `scale(${scale})`
    };
    
    // Apply custom properties if provided
    if (backgroundColor) customStyle.backgroundColor = backgroundColor;
    if (textColor) customStyle.color = textColor;
    if (borderRadius) customStyle.borderRadius = borderRadius;
    if (borderColor) {
      customStyle.borderColor = borderColor;
      customStyle.borderWidth = borderWidth;
      customStyle.borderStyle = "solid";
    }
    
    switch (style) {
      case "colored":
        return {
          className: `${baseClasses} rounded-full text-white hover:brightness-110 hover:scale-105 ${hoverColor ? 'hover:brightness-110' : ''}`,
          style: { 
            ...customStyle,
            backgroundColor: customStyle.backgroundColor || buttonColor 
          }
        };
      case "rounded":
        return {
          className: `${baseClasses} rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105`,
          style: { ...customStyle }
        };
      case "outlined":
        return {
          className: `${baseClasses} rounded-full border hover:bg-gray-50 hover:scale-105`,
          style: { 
            ...customStyle,
            borderColor: customStyle.borderColor || buttonColor, 
            color: customStyle.color || buttonColor 
          }
        };
      default:
        return {
          className: `${baseClasses} text-gray-700 hover:text-gray-900 hover:scale-105`,
          style: { ...customStyle }
        };
    }
  }, [style, platform, iconSize.containerSize, backgroundColor, textColor, borderRadius, hoverColor, borderColor, borderWidth, scale]);

  return {
    buttonStyles,
    iconSize: iconSize.iconSize,
  };
};

export default useSocialIconStyles;
