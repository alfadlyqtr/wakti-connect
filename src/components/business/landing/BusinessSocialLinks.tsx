
import React from "react";
import { Facebook, Instagram, Twitter, Linkedin, Globe } from "lucide-react";
import { BusinessSocialLink } from "@/types/business.types";

interface BusinessSocialLinksProps {
  socialLinks: BusinessSocialLink[];
  iconsStyle?: "default" | "colored" | "outlined";
  size?: "small" | "default" | "large";
}

const BusinessSocialLinks: React.FC<BusinessSocialLinksProps> = ({
  socialLinks,
  iconsStyle = "default",
  size = "default"
}) => {
  // Size classes for the icons
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-5 w-5",
    large: "h-6 w-6"
  };

  // Container size classes
  const containerSizeClasses = {
    small: "p-1.5",
    default: "p-2",
    large: "p-2.5"
  };

  // Style classes for the icon containers
  const styleClasses = {
    default: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    colored: "text-white",
    outlined: "border border-gray-300 text-gray-600 hover:border-gray-400"
  };

  // Get color for specific platform
  const getPlatformColor = (platform: string): string => {
    switch (platform) {
      case 'facebook': return "bg-blue-600 hover:bg-blue-700";
      case 'instagram': return "bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700";
      case 'twitter': return "bg-sky-500 hover:bg-sky-600";
      case 'linkedin': return "bg-blue-700 hover:bg-blue-800";
      case 'website': return "bg-gray-700 hover:bg-gray-800";
      default: return "bg-gray-600 hover:bg-gray-700";
    }
  };

  // Get the appropriate icon
  const getIconForPlatform = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className={sizeClasses[size]} />;
      case 'instagram': return <Instagram className={sizeClasses[size]} />;
      case 'twitter': return <Twitter className={sizeClasses[size]} />;
      case 'linkedin': return <Linkedin className={sizeClasses[size]} />;
      case 'website': return <Globe className={sizeClasses[size]} />;
      default: return <Globe className={sizeClasses[size]} />;
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {socialLinks.map((link) => (
        <a
          key={link.id || link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            flex items-center justify-center rounded-full transition-all duration-300
            ${containerSizeClasses[size]}
            ${iconsStyle === "colored" ? getPlatformColor(link.platform) : styleClasses[iconsStyle]}
            hover:shadow-md hover:-translate-y-0.5
          `}
          aria-label={link.platform}
        >
          {getIconForPlatform(link.platform)}
        </a>
      ))}
    </div>
  );
};

export default BusinessSocialLinks;
