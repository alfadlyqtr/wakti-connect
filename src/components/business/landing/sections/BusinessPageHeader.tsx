
import React from "react";

interface BusinessPageHeaderProps {
  content: Record<string, any>;
}

const BusinessPageHeader: React.FC<BusinessPageHeaderProps> = ({ content }) => {
  const {
    title = "Welcome to Our Business",
    subtitle = "We provide quality products and services",
    description = "Learn more about what we can do for you",
    buttonText = "Contact Us",
    buttonLink = "#contact",
    backgroundImage,
    alignment = "center"
  } = content;

  const containerClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end"
  };

  const alignmentClass = containerClasses[alignment as keyof typeof containerClasses] || containerClasses.center;

  return (
    <section className="relative">
      {/* Background overlay & image */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/40 z-10"></div>
      {backgroundImage ? (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-muted/30"></div>
      )}

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-20 md:py-32">
        <div className={`flex flex-col ${alignmentClass} max-w-3xl mx-auto space-y-6`}>
          {title && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">{title}</h1>
          )}
          
          {subtitle && (
            <h2 className="text-2xl md:text-3xl font-medium">{subtitle}</h2>
          )}
          
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl">{description}</p>
          )}
          
          {buttonText && (
            <div className="pt-4">
              <a
                href={buttonLink}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/70"
              >
                {buttonText}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BusinessPageHeader;
