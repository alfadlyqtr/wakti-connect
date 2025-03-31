
import React from "react";
import { useSocialIconStyles } from "@/hooks/useSocialIconStyles";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Globe } from "lucide-react";

interface SocialIconProps {
  platform: string;
  url: string;
  style?: "default" | "colored" | "rounded" | "outlined";
  size?: "small" | "default" | "large";
}

const SocialIcon: React.FC<SocialIconProps> = ({
  platform,
  url,
  style = "default",
  size = "default"
}) => {
  const { buttonStyles, iconSize } = useSocialIconStyles({ style, size, platform });

  const renderIcon = () => {
    const iconProps = { className: iconSize };

    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook {...iconProps} />;
      case "instagram":
        return <Instagram {...iconProps} />;
      case "twitter":
        return <Twitter {...iconProps} />;
      case "linkedin":
        return <Linkedin {...iconProps} />;
      case "youtube":
        return <Youtube {...iconProps} />;
      case "website":
      default:
        return <Globe {...iconProps} />;
    }
  };

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonStyles.className}
      style={buttonStyles.style}
      aria-label={`Visit our ${platform}`}
    >
      {renderIcon()}
    </a>
  );
};

export default SocialIcon;
