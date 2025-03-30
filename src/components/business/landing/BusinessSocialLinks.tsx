
import React from "react";
import { BusinessSocialLink } from "@/types/business.types";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  TikTok,
  PinterestIcon,
  Globe, 
  LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BusinessSocialLinksProps {
  socialLinks: BusinessSocialLink[];
  iconsStyle?: 'default' | 'colored' | 'rounded' | 'outlined';
  size?: 'small' | 'default' | 'large';
  vertical?: boolean;
}

const BusinessSocialLinks = ({ 
  socialLinks, 
  iconsStyle = 'default',
  size = 'default',
  vertical = false
}: BusinessSocialLinksProps) => {
  const getSocialIcon = (platform: string): LucideIcon => {
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
        return TikTok as unknown as LucideIcon;
      case 'pinterest':
        return PinterestIcon as unknown as LucideIcon;
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
      "animate-fade-in"
    )}>
      {socialLinks.map((link) => {
        const Icon = getSocialIcon(link.platform);
        const color = getPlatformColor(link.platform);
        const iconSize = getIconSize();
        const btnSize = getButtonSize();
        
        return (
          <Button
            key={link.id}
            variant={iconsStyle === 'outlined' ? "outline" : iconsStyle === 'rounded' ? "secondary" : "ghost"}
            size={btnSize}
            className={cn(
              "rounded-full transition-transform hover:scale-110",
              iconsStyle === 'colored' && "text-white"
            )}
            style={{
              backgroundColor: iconsStyle === 'colored' ? color : undefined
            }}
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
