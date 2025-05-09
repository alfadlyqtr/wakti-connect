
import React from "react";
import { SectionType } from "../types";
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";

interface SocialSectionProps {
  section: SectionType;
  isActive: boolean;
  onClick: () => void;
}

const SocialSection: React.FC<SocialSectionProps> = ({ section, isActive, onClick }) => {
  const platforms = section.content.platforms || {
    facebook: false,
    instagram: false,
    twitter: false,
    email: false,
    phone: false,
    whatsapp: false
  };
  
  const layout = section.activeLayout || "horizontal";
  
  const getIcons = () => {
    const icons = [];
    
    if (platforms.facebook) icons.push({
      icon: <Facebook className="h-6 w-6" />,
      name: "Facebook"
    });
    
    if (platforms.instagram) icons.push({
      icon: <Instagram className="h-6 w-6" />,
      name: "Instagram"
    });
    
    if (platforms.twitter) icons.push({
      icon: <Twitter className="h-6 w-6" />,
      name: "Twitter"
    });
    
    if (platforms.email) icons.push({
      icon: <Mail className="h-6 w-6" />,
      name: "Email"
    });
    
    if (platforms.phone) icons.push({
      icon: <Phone className="h-6 w-6" />,
      name: "Phone"
    });
    
    return icons;
  };
  
  const icons = getIcons();
  
  return (
    <div 
      className={`p-8 transition-all ${isActive ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'}`}
      onClick={onClick}
    >
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">{section.title}</h2>
        {section.subtitle && <p className="text-gray-600">{section.subtitle}</p>}
      </div>
      
      <div className={`flex gap-6 ${layout === "horizontal" ? "justify-center" : "flex-col items-center"}`}>
        {icons.length > 0 ? (
          icons.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
            >
              {item.icon}
              {layout !== "horizontal" && (
                <span className="ml-2">{item.name}</span>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-400">
            {isActive ? "Select social media platforms in the editor" : "No social media links added"}
          </div>
        )}
      </div>
      
      {isActive && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
          Editing
        </div>
      )}
    </div>
  );
};

export default SocialSection;
