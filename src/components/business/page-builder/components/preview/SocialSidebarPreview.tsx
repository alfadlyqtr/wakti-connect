
import React from "react";
import { useBusinessPage, SocialPlatforms } from "../../context/BusinessPageContext";
import { Mail, MapPin, Phone } from "lucide-react";

// Facebook icon component
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
  </svg>
);

// Instagram icon component
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z" />
  </svg>
);

// Custom WhatsApp icon component with more accurate branding
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M17.6 6.32C16.8991 5.61748 16.0627 5.0664 15.1346 4.69473C14.2065 4.32305 13.209 4.13878 12.2 4.15C7.9 4.15 4.4 7.65 4.4 12C4.4 13.5 4.8 14.95 5.55 16.2L4.33 19.7L7.93 18.5C9.15 19.2 10.55 19.55 12 19.55C16.3 19.55 19.8 16.05 19.8 11.7C19.8 9.67 19.03 7.72 17.6 6.32ZM12.2 18.15C10.9 18.15 9.65 17.8 8.53 17.17L8.25 17L6.15 17.7L6.85 15.65L6.65 15.35C5.96165 14.1881 5.59149 12.8567 5.59 11.5C5.59 8.42 8.57 5.85 12.19 5.85C13.8 5.85 15.31 6.45 16.46 7.52C17.0263 8.08414 17.4759 8.76503 17.7764 9.51824C18.0768 10.2715 18.2211 11.0798 18.2 11.895C18.2 15.45 15.53 18.15 12.2 18.15ZM15.03 13.42C14.84 13.325 13.91 12.875 13.74 12.805C13.57 12.735 13.44 12.7 13.31 12.89C13.18 13.08 12.82 13.5 12.71 13.63C12.6 13.76 12.49 13.78 12.3 13.68C11.32 13.19 10.7 12.8 10.07 11.67C9.9 11.38 10.13 11.39 10.34 10.97C10.385 10.87 10.405 10.76 10.4 10.65C10.395 10.54 10.365 10.435 10.31 10.34C10.24 10.2 9.9 9.27 9.74 8.88C9.58 8.5 9.42 8.56 9.3 8.55C9.19 8.541 9.08028 8.536 8.97 8.535C8.89083 8.53579 8.81235 8.5544 8.74 8.59C8.66765 8.62559 8.60399 8.67757 8.55308 8.74207C8.50218 8.80656 8.46515 8.88202 8.44466 8.96381C8.42416 9.0456 8.42069 9.13174 8.435 9.215C8.77 10.26 9.25 11.255 10.11 12.115C11.34 13.335 12.92 14.035 13.87 14.335C14.31 14.485 14.89 14.595 15.42 14.525C15.7181 14.4953 15.9999 14.3793 16.2283 14.1913C16.4568 14.0033 16.6221 13.7516 16.7 13.47C16.8 13.12 16.76 12.735 16.68 12.625L16.03 13.025L15.03 13.42Z" />
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
        return <FacebookIcon className="h-5 w-5" />;
      case "instagram":
        return <InstagramIcon className="h-5 w-5" />;
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
