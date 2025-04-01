
import React from "react";
import { SocialIconStyle, SocialIconSize } from "@/types/business.types";
import { useSocialIconStyles } from "@/hooks/useSocialIconStyles";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Globe } from "lucide-react";

interface SocialIconProps {
  platform: string;
  url: string;
  style?: SocialIconStyle;
  size?: SocialIconSize;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  hoverColor?: string;
  borderColor?: string;
  borderWidth?: string;
  hoverBorderColor?: string;
  scale?: number;
}

// Custom WhatsApp icon component - fixed to properly display WhatsApp icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
    <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
    <path d="M8.5 13.5a5 5 0 0 0 7 0" />
  </svg>
);

// Custom Pinterest icon
const PinterestIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v8" />
    <path d="m9 15 3 3 3-3" />
  </svg>
);

// Custom TikTok icon
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    <path d="M16 8v8" />
    <path d="M12 16v-8" />
    <path d="M20 10c0-1.657-1.343-3-3-3s-3 1.343-3 3" />
  </svg>
);

const SocialIcon: React.FC<SocialIconProps> = ({
  platform,
  url,
  style = "default",
  size = "default",
  backgroundColor,
  textColor,
  borderRadius,
  hoverColor,
  borderColor,
  borderWidth,
  hoverBorderColor,
  scale
}) => {
  const { buttonStyles, iconSize } = useSocialIconStyles({ 
    style, 
    size, 
    platform,
    backgroundColor,
    textColor,
    borderRadius,
    hoverColor,
    borderColor,
    borderWidth,
    hoverBorderColor,
    scale
  });

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
      case "tiktok":
        return <TikTokIcon {...iconProps} />;
      case "pinterest":
        return <PinterestIcon {...iconProps} />;
      case "whatsapp":
        return <WhatsAppIcon {...iconProps} />;
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
