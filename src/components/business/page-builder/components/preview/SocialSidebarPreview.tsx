
import React from "react";
import { useBusinessPage, SocialPlatforms } from "../../context/BusinessPageContext";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

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

export const SocialSidebarPreview = () => {
  const { pageData } = useBusinessPage();
  const { position, platforms } = pageData.socialSidebar;
  const { contactInfo } = pageData;
  
  // Helper function to get URL for each platform
  const getPlatformUrl = (platform: keyof SocialPlatforms): string => {
    switch (platform) {
      case "whatsapp":
        return contactInfo.whatsapp ? 
          `https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}` : "#";
      case "whatsappBusiness":
        return contactInfo.whatsappBusiness ? 
          `https://wa.me/${contactInfo.whatsappBusiness.replace(/\D/g, '')}` : "#";
      case "facebook":
        return contactInfo.facebook ? 
          `https://facebook.com/${contactInfo.facebook}` : "#";
      case "instagram":
        return contactInfo.instagram ? 
          `https://instagram.com/${contactInfo.instagram}` : "#";
      case "googleMaps":
        return contactInfo.googleMaps || "#";
      case "phone":
        return contactInfo.phone ? 
          `tel:${contactInfo.phone}` : "#";
      case "email":
        return contactInfo.email ? 
          `mailto:${contactInfo.email}` : "#";
      default:
        return "#";
    }
  };
  
  // Helper function to get icon for each platform
  const getPlatformIcon = (platform: keyof SocialPlatforms) => {
    switch (platform) {
      case "whatsapp":
      case "whatsappBusiness":
        return <WhatsAppIcon className="h-5 w-5" />;
      case "facebook":
        return <Facebook className="h-5 w-5" />;
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      case "googleMaps":
        return <MapPin className="h-5 w-5" />;
      case "phone":
        return <Phone className="h-5 w-5" />;
      case "email":
        return <Mail className="h-5 w-5" />;
      default:
        return null;
    }
  };

  // Get the platforms that are enabled
  const enabledPlatforms = Object.entries(platforms)
    .filter(([_, isEnabled]) => isEnabled)
    .map(([platform]) => platform as keyof SocialPlatforms);
  
  if (enabledPlatforms.length === 0) {
    return null;
  }

  const positionClass = position === "left" ? "left-4" : "right-4";
  
  return (
    <div 
      className={`fixed top-1/2 transform -translate-y-1/2 ${positionClass} space-y-2`}
      style={{ zIndex: 900 }}
    >
      {enabledPlatforms.map((platform) => {
        const url = getPlatformUrl(platform);
        const icon = getPlatformIcon(platform);
        
        return (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-background border shadow-md rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            {icon}
          </a>
        );
      })}
    </div>
  );
};
