
import React from "react";
import { BusinessPageSection } from "@/types/business.types";

interface HeaderSectionProps {
  section: BusinessPageSection;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ section }) => {
  const content = section.section_content || {};
  
  const {
    title = "Welcome",
    subtitle = "",
    description = "",
    buttonText = "Learn More",
    buttonLink = "#",
    backgroundImage = ""
  } = content;
  
  return (
    <section className="py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      {subtitle && <p className="text-2xl mb-6">{subtitle}</p>}
      {description && <p className="text-lg mb-8 max-w-3xl mx-auto">{description}</p>}
      {buttonText && (
        <a 
          href={buttonLink}
          className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
        >
          {buttonText}
        </a>
      )}
    </section>
  );
};

export default HeaderSection;
