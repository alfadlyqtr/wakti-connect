
import React from "react";
import { BusinessSocialLink, SocialIconStyle, SocialIconSize, SocialIconPosition } from "@/types/business.types";
import SocialIconsGroup from "./SocialIconsGroup";

interface SidebarSocialLinksProps {
  socialLinks: BusinessSocialLink[];
  style: SocialIconStyle;
  size: SocialIconSize;
  position: SocialIconPosition;
}

const SidebarSocialLinks: React.FC<SidebarSocialLinksProps> = ({
  socialLinks,
  style,
  size,
  position
}) => {
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop version - inside the page with proper padding */}
      <div className="fixed z-30 top-1/2 transform -translate-y-1/2 hidden md:block"
           style={{
             [position === 'left' ? 'left' : 'right']: '20px',
           }}>
        <SocialIconsGroup 
          socialLinks={socialLinks}
          style={style || "default"}
          size={size || "default"}
          position={position as SocialIconPosition}
          vertical={true}
        />
      </div>
      
      {/* Mobile version - with smaller padding */}
      <div className="fixed z-30 top-1/2 transform -translate-y-1/2 block md:hidden"
           style={{
             [position === 'left' ? 'left' : 'right']: '10px',
           }}>
        <SocialIconsGroup 
          socialLinks={socialLinks}
          style={style || "default"}
          size="small"
          position={position as SocialIconPosition}
          vertical={true}
          scale={0.8}
        />
      </div>
    </>
  );
};

export default SidebarSocialLinks;
