
import React from "react";
import SocialIcon from "./SocialIcon";
import { BusinessSocialLink, SocialIconStyle, SocialIconSize } from "@/types/business.types";
import { cn } from "@/lib/utils";

interface SocialIconsGroupProps {
  socialLinks: BusinessSocialLink[];
  style?: SocialIconStyle;
  size?: SocialIconSize;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'header' | 'footer' | 'sidebar' | 'both';
  vertical?: boolean;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  hoverColor?: string;
  spacing?: 'tight' | 'default' | 'loose';
  borderColor?: string;
  borderWidth?: string;
  hoverBorderColor?: string;
  opacity?: number;
  scale?: number;
}

const SocialIconsGroup: React.FC<SocialIconsGroupProps> = ({
  socialLinks,
  style = "default",
  size = "default",
  className = "",
  position = "footer",
  vertical = false,
  backgroundColor,
  textColor,
  borderRadius,
  hoverColor,
  spacing = "default",
  borderColor,
  borderWidth,
  hoverBorderColor,
  opacity = 1,
  scale = 1
}) => {
  if (!socialLinks || socialLinks.length === 0) {
    console.log("No social links to display");
    return null;
  }

  console.log("SocialIconsGroup rendering with position:", position, "and links:", socialLinks.length, "vertical:", vertical);

  // Determine spacing class based on the spacing prop
  const getSpacingClass = () => {
    switch (spacing) {
      case 'tight': return 'gap-1';
      case 'loose': return 'gap-4';
      default: return 'gap-2';
    }
  };

  // Determine position classes
  const getPositionClass = () => {
    switch (position) {
      case 'header': return 'justify-end';
      case 'footer': return 'justify-center';
      case 'sidebar': return 'justify-start items-center';
      case 'top': return 'justify-center mt-4';
      case 'bottom': return 'justify-center mb-4';
      case 'left': return 'justify-start';
      case 'right': return 'justify-end';
      case 'both': 
        // For "both" position, the parent container should apply appropriate positioning
        return className.includes('justify-end') ? 'justify-end' : 'justify-center';
      default: return 'justify-center';
    }
  };

  return (
    <div className={cn(
      "flex items-center", 
      getSpacingClass(),
      getPositionClass(),
      vertical ? "flex-col" : "flex-row flex-wrap",
      className
    )}
    style={{ opacity }}>
      {socialLinks.map((link) => (
        <SocialIcon
          key={link.id}
          platform={link.platform}
          url={link.url}
          style={style}
          size={size}
          backgroundColor={backgroundColor}
          textColor={textColor}
          borderRadius={borderRadius}
          hoverColor={hoverColor}
          borderColor={borderColor}
          borderWidth={borderWidth}
          hoverBorderColor={hoverBorderColor}
          scale={scale}
        />
      ))}
    </div>
  );
};

export default SocialIconsGroup;
