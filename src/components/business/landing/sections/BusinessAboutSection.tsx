
import React from "react";

interface BusinessAboutSectionProps {
  content: Record<string, any>;
}

const BusinessAboutSection: React.FC<BusinessAboutSectionProps> = ({ content }) => {
  const { 
    title = "About Us",
    description = "Learn more about our business and what we do.",
    content: aboutContent = "",
    image
  } = content;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {image && (
            <div className="md:w-1/2">
              <img 
                src={image} 
                alt="About us" 
                className="rounded-lg w-full h-auto object-cover shadow-md"
              />
            </div>
          )}
          
          <div className={image ? "md:w-1/2" : "w-full"}>
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
    </section>
  );
};

export default BusinessAboutSection;
