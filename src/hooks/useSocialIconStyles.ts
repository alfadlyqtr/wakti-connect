
import { useMemo } from "react";
import { SocialIconStyle, SocialIconSize } from "@/types/business.types";

export interface SocialIconStyleProps {
  style?: SocialIconStyle;
  size?: SocialIconSize;
  platform: string;
}

export const useSocialIconStyles = ({ style = "default", size = "default", platform }: SocialIconStyleProps) => {
  const platformColors: Record<string, string> = {
    facebook: "#1877F2",
    instagram: "#E4405F",
    twitter: "#1DA1F2",
    linkedin: "#0A66C2",
    youtube: "#FF0000",
    tiktok: "#000000",
    pinterest: "#BD081C",
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
    const buttonColor = platformColors[platform] || "#6E6E6E";
    
    switch (style) {
      case "colored":
        return {
          className: `${baseClasses} rounded-full text-white hover:brightness-110 hover:scale-105`,
          style: { backgroundColor: buttonColor }
        };
      case "rounded":
        return {
          className: `${baseClasses} rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105`,
          style: {}
        };
      case "outlined":
        return {
          className: `${baseClasses} rounded-full border hover:bg-gray-50 hover:scale-105`,
          style: { borderColor: buttonColor, color: buttonColor }
        };
      default:
        return {
          className: `${baseClasses} text-gray-700 hover:text-gray-900 hover:scale-105`,
          style: {}
        };
    }
  }, [style, platform, iconSize.containerSize]);

  return {
    buttonStyles,
    iconSize: iconSize.iconSize,
  };
};

export default useSocialIconStyles;
