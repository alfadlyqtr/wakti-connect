
import React from "react";
import { BusinessPage, BusinessPageSection } from "@/types/business.types";

interface BusinessHeaderProps {
  section: BusinessPageSection;
  businessPage: BusinessPage;
}

const BusinessHeader = ({ section, businessPage }: BusinessHeaderProps) => {
  const content = section.section_content || {};
  
  const {
    title = businessPage.page_title,
    subtitle = businessPage.description || "Book our services online", // Use description as subtitle
    description = "", // Keep the third level description empty or use it for additional content
  } = content;

  console.log("BusinessHeader rendering with logo:", businessPage.logo_url);
  console.log("BusinessHeader styles:", {
    primaryColor: businessPage.primary_color,
    secondaryColor: businessPage.secondary_color
  });
  
  return (
    <div className="text-center py-8 md:py-16">
      {businessPage.logo_url && (
        <div className="flex justify-center mb-4">
          <img 
            src={businessPage.logo_url} 
            alt={businessPage.page_title || "Business"} 
            className="h-24 w-24 rounded-full object-cover border-2 border-primary/20 mb-4"
            onError={(e) => {
              console.error("Error loading logo image:", e);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{title}</h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-4">{subtitle}</p>
      
      {description && (
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">{description}</p>
      )}
    </div>
  );
};

export default BusinessHeader;
