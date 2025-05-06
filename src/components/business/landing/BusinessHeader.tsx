
import React from "react";
import { BusinessPageSection } from "@/types/business.types";

interface BusinessHeaderProps {
  section: BusinessPageSection;
}

const BusinessHeader = ({ section }: BusinessHeaderProps) => {
  const content = section.section_content || {};
  
  const {
    title = "Welcome",
    subtitle = "",
    description = "",
    buttonText = "Learn More",
    buttonLink = "#",
    backgroundImage = "",
    overlayOpacity = 50,
    textColor = "light",
    alignment = "center"
  } = content;
  
  const containerClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end"
  };

  const textClasses = {
    dark: "text-gray-900",
    light: "text-white"
  };

  const alignmentClass = containerClasses[alignment as keyof typeof containerClasses] || containerClasses.center;
  const textColorClass = textClasses[textColor as keyof typeof textClasses] || textClasses.dark;

  // Calculate overlay opacity (0-100 scale to 0-1)
  const opacity = Math.max(0, Math.min(100, overlayOpacity)) / 100;
  
  return (
    <section className="relative min-h-[60vh] flex items-center">
      {/* Background overlay & image */}
      <div 
        className="absolute inset-0 bg-black z-10"
        style={{ opacity }}
      ></div>
      
      {backgroundImage ? (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900"></div>
      )}

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-20">
        <div className={`flex flex-col ${alignmentClass} max-w-3xl mx-auto space-y-6 ${textColorClass}`}>
          {title && (
            <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
          )}
          
          {subtitle && (
            <h2 className="text-2xl md:text-3xl font-medium opacity-90">{subtitle}</h2>
          )}
          
          {description && (
            <p className="text-lg max-w-2xl opacity-90">{description}</p>
          )}
          
          {buttonText && (
            <div className="pt-6">
              <a
                href={buttonLink}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/70 transition-all"
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

export default BusinessHeader;
