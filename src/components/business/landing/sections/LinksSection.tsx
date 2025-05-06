
import React from "react";
import { BusinessPageSection } from "@/types/business.types";

interface LinksSectionProps {
  section: BusinessPageSection;
}

const LinksSection: React.FC<LinksSectionProps> = ({ section }) => {
  const content = section.section_content || {};
  
  const {
    title = "Important Links",
    description = "",
    links = []
  } = content;
  
  if (!links || links.length === 0) {
    return null;
  }
  
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
      {description && <p className="text-center mb-6">{description}</p>}
      
      <div className="flex flex-col items-center space-y-4 max-w-md mx-auto">
        {links.map((link: any, index: number) => (
          <a 
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-6 py-3 bg-card border rounded-md text-center hover:bg-muted transition-colors"
          >
            {link.title || link.url}
          </a>
        ))}
      </div>
    </section>
  );
};

export default LinksSection;
