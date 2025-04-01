
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
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-30 hidden md:block">
        <SocialIconsGroup 
          socialLinks={socialLinks}
          style={style || "default"}
          size={size || "default"}
          position={position}
          vertical={true}
        />
      </div>
      
      <div className="fixed left-2 top-1/2 transform -translate-y-1/2 z-30 block md:hidden">
        <SocialIconsGroup 
          socialLinks={socialLinks}
          style={style || "default"}
          size="small"
          position={position}
          vertical={true}
          scale={0.8}
        />
      </div>
    </>
  );
};

export default SidebarSocialLinks;
