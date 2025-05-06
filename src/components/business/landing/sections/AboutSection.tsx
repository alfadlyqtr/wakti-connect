
import React from "react";
import { BusinessPageSection } from "@/types/business.types";

interface AboutSectionProps {
  section: BusinessPageSection;
}

const AboutSection: React.FC<AboutSectionProps> = ({ section }) => {
  const content = section.section_content || {};
  
  const {
    title = "About Us",
    description = "",
    content: aboutContent = ""
  } = content;
  
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {description && <p className="text-lg mb-6">{description}</p>}
      <div dangerouslySetInnerHTML={{ __html: aboutContent }} />
    </section>
  );
};

export default AboutSection;
