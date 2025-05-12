
import React from "react";
import { BusinessSocialLink, SocialIconStyle, SocialIconSize } from "@/types/business.types";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube,
  Globe,
  MessageCircle,
  Map
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BusinessSocialLinksProps {
  socialLinks: BusinessSocialLink[];
  iconsStyle?: SocialIconStyle;
  size?: SocialIconSize;
  vertical?: boolean;
  className?: string;
  buttonClassName?: string;
  iconPosition?: 'top' | 'bottom' | 'left' | 'right' | 'footer' | 'header' | 'sidebar';
  backgroundColor?: string;
  textColor?: string;
  hoverColor?: string;
  borderRadius?: string;
}

// Custom Pinterest icon component since it's not in lucide-react
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

const BusinessSocialLinks = ({ 
  socialLinks, 
  iconsStyle = 'default',
  size = 'default',
  vertical = false,
  className = "",
  buttonClassName = "",
  iconPosition = 'footer',
  backgroundColor,
  textColor,
  hoverColor,
  borderRadius
}: BusinessSocialLinksProps) => {
  const getSocialIcon = (platform: string): any => {
    switch (platform) {
      case 'facebook':
        return Facebook;
      case 'instagram':
        return Instagram;
      case 'twitter':
        return Twitter;
      case 'linkedin':
        return Linkedin;
      case 'youtube':
        return Youtube;
      case 'tiktok':
        return TikTokIcon;
      case 'pinterest':
        return PinterestIcon;
      case 'whatsapp':
        return WhatsAppIcon;
      case 'maps':
        return Map;
      case 'website':
      default:
        return Globe;
    }
  };
  
  const getPlatformColor = (platform: string): string => {
    if (iconsStyle !== 'colored') return '';
    
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
      case 'maps':
        return '#4285F4'; // Google Maps blue
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
  
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }
  
  return (
    <div className={cn(
      "flex gap-2 justify-center",
      vertical ? "flex-col" : "flex-wrap",
      "animate-fade-in",
      className
    )}>
      {socialLinks.map((link) => {
        const Icon = getSocialIcon(link.platform);
        const color = getPlatformColor(link.platform);
        const iconSize = getIconSize();
        const btnSize = getButtonSize();
        
        // Custom styling based on props
        const customStyle: React.CSSProperties = {};
        if (backgroundColor) customStyle.backgroundColor = backgroundColor;
        if (textColor) customStyle.color = textColor;
        if (borderRadius) customStyle.borderRadius = borderRadius;
        
        // Override color for colored style
        if (iconsStyle === 'colored') {
          customStyle.backgroundColor = color;
          customStyle.color = '#ffffff';
        }
        
        return (
          <Button
            key={link.id}
            variant={iconsStyle === 'outlined' ? "outline" : iconsStyle === 'rounded' ? "secondary" : "ghost"}
            size={btnSize}
            className={cn(
              "rounded-full transition-transform hover:scale-110",
              iconsStyle === 'colored' && "text-white",
              buttonClassName,
              hoverColor && "hover:brightness-110"
            )}
            style={customStyle}
            asChild
          >
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={`Visit our ${link.platform} page`}
            >
              <Icon size={iconSize} className={iconsStyle === 'colored' ? "text-white" : ""} />
            </a>
          </Button>
        );
      })}
    </div>
  );
};

export default BusinessSocialLinks;
