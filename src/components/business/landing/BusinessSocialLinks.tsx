
import React from "react";
import { BusinessSocialLink } from "@/types/business.types";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Globe, 
  LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BusinessSocialLinksProps {
  socialLinks: BusinessSocialLink[];
}

const BusinessSocialLinks = ({ socialLinks }: BusinessSocialLinksProps) => {
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
      case 'website':
      default:
        return Globe;
    }
  };
  
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {socialLinks.map((link) => {
        const Icon = getSocialIcon(link.platform);
        return (
          <Button
            key={link.id}
            variant="outline"
            size="icon"
            asChild
          >
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <Icon className="h-4 w-4" />
            </a>
          </Button>
        );
      })}
    </div>
  );
};

export default BusinessSocialLinks;
