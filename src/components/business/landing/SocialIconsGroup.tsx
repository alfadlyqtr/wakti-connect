
import React from "react";
import SocialIcon from "./SocialIcon";
import { BusinessSocialLink } from "@/types/business.types";

interface SocialIconsGroupProps {
  socialLinks: BusinessSocialLink[];
  style?: "default" | "colored" | "rounded" | "outlined";
  size?: "small" | "default" | "large";
  className?: string;
}

const SocialIconsGroup: React.FC<SocialIconsGroupProps> = ({
  socialLinks,
  style = "default",
  size = "default",
  className = ""
}) => {
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {socialLinks.map((link) => (
        <SocialIcon
          key={link.id}
          platform={link.platform}
          url={link.url}
          style={style}
          size={size}
        />
      ))}
    </div>
  );
};

export default SocialIconsGroup;
