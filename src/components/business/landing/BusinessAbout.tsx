
import React from "react";
import { BusinessPageSection } from "@/types/business.types";

interface BusinessAboutProps {
  section: BusinessPageSection;
}

const BusinessAbout = ({ section }: BusinessAboutProps) => {
  const content = section.section_content || {};
  
  const {
    title = "About Us",
    content: aboutContent = "",
    image = null
  } = content;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        {image && (
          <div className="md:w-1/3">
            <img 
              src={image} 
              alt="About us" 
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>
        )}
        
        <div className={image ? "md:w-2/3" : "w-full"}>
          <div className="prose max-w-none dark:prose-invert">
            {aboutContent ? (
              <div dangerouslySetInnerHTML={{ __html: aboutContent }} />
            ) : (
              <p className="text-muted-foreground">
                Information about the business will be displayed here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessAbout;
