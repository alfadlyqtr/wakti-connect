
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
    alignment = "center",
    overlayOpacity = 80,
    textColor = "dark",
    primary_color,
    secondary_color,
    logo_url
  } = content;

  console.log("BusinessPageHeader rendering with:", {
    primary_color,
    secondary_color,
    logo_url
  });

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

  // Style for the button using primary color
  const buttonStyle = primary_color ? {
    backgroundColor: primary_color,
    color: "#ffffff"
  } : {};

  return (
    <section className="relative">
      {/* Background overlay & image */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/40 z-10"
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
        <div className="absolute inset-0 bg-muted/30"></div>
      )}

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-20 md:py-32">
        <div className={`flex flex-col ${alignmentClass} max-w-3xl mx-auto space-y-6 ${textColorClass}`}>
          {/* Logo display */}
          {logo_url && (
            <div className="mb-6 animate-fade-in">
              <img 
                src={logo_url} 
                alt={title} 
                className="h-24 w-24 rounded-full object-cover mx-auto"
                onError={(e) => {
                  console.error("Error loading logo image:", e);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          
          {title && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold animate-fade-in">{title}</h1>
          )}
          
          {subtitle && (
            <h2 className="text-2xl md:text-3xl font-medium animate-fade-in animation-delay-200">{subtitle}</h2>
          )}
          
          {description && (
            <p className="text-lg max-w-2xl animate-fade-in animation-delay-300">{description}</p>
          )}
          
          {buttonText && (
            <div className="pt-4 animate-fade-in animation-delay-400">
              <a
                href={buttonLink}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/70 transition-all hover:scale-105"
                style={buttonStyle}
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
