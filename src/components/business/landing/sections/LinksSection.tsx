
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import { ExternalLink } from "lucide-react";

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
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          {description && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>}
        </div>
        
        <div className="flex flex-col items-center space-y-4 max-w-lg mx-auto">
          {links.map((link: any, index: number) => (
            <a 
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-6 py-4 bg-card border rounded-lg text-center hover:bg-muted transition-colors flex items-center justify-between"
            >
              <span className="font-medium">{link.title || link.url}</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LinksSection;
