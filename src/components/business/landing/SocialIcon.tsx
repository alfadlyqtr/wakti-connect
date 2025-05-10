
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Globe,
  MessageCircle
} from "lucide-react";
import { SocialIconSize, SocialIconStyle } from "@/types/business.types";

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

// Custom Pinterest icon component
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

// Custom TikTok icon component
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

// Custom WhatsApp icon component
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

const SocialIcon: React.FC<SocialIconProps> = ({ 
  platform, 
  url, 
  style = 'default',
  size = 'default',
  backgroundColor,
  textColor,
  borderRadius,
  hoverColor,
  borderColor,
  borderWidth,
  hoverBorderColor,
  scale = 1
}) => {
  const getIcon = () => {
    switch (platform) {
      case 'facebook':
        return <Facebook />;
      case 'instagram':
        return <Instagram />;
      case 'twitter':
        return <Twitter />;
      case 'linkedin':
        return <Linkedin />;
      case 'youtube':
        return <Youtube />;
      case 'tiktok':
        return <TikTokIcon />;
      case 'pinterest':
        return <PinterestIcon />;
      case 'whatsapp':
        return <WhatsAppIcon />;
      case 'website':
      default:
        return <Globe />;
    }
  };
  
  const getPlatformColor = (): string => {
    if (style !== 'colored') return '';
    
    switch (platform) {
      case 'facebook':
        return '#1877F2';
      case 'instagram':
        return '#E4405F';
      case 'twitter':
        return '#1DA1F2';
      case 'linkedin':
        return '#0A66C2';
      case 'youtube':
        return '#FF0000';
      case 'tiktok':
        return '#000000';
      case 'pinterest':
        return '#E60023';
      case 'whatsapp':
        return '#25D366';
      default:
        return '#6B7280';
    }
  };
  
  const getIconSize = (): number => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };
  
  const getButtonSize = (): "sm" | "default" | "lg" | "icon" => {
    switch (size) {
      case 'small':
        return 'sm';
      case 'large':
        return 'lg';
      default:
        return 'default';
    }
  };
  
  // Custom styling based on props
  const customStyle: React.CSSProperties = {
    transform: `scale(${scale})`
  };
  
  if (backgroundColor) customStyle.backgroundColor = backgroundColor;
  if (textColor) customStyle.color = textColor;
  if (borderRadius) customStyle.borderRadius = borderRadius;
  
  // Override color for colored style
  if (style === 'colored') {
    customStyle.backgroundColor = getPlatformColor();
    customStyle.color = '#ffffff';
  }
  
  const Icon = getIcon();
  const iconSize = getIconSize();
  const btnSize = getButtonSize();
  
  return (
    <Button
      variant={style === 'outlined' ? "outline" : style === 'rounded' ? "secondary" : "ghost"}
      size={btnSize}
      className={cn(
        "rounded-full transition-transform hover:scale-110",
        style === 'colored' && "text-white",
        hoverColor && "hover:brightness-110"
      )}
      style={customStyle}
      asChild
    >
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label={`Visit our ${platform} page`}
      >
        {React.cloneElement(Icon, { size: iconSize, className: style === 'colored' ? "text-white" : "" })}
      </a>
    </Button>
  );
};

export default SocialIcon;
