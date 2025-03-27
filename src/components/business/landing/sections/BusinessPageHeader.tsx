
import React from "react";

interface BusinessPageHeaderProps {
  content: Record<string, any>;
}

const BusinessPageHeader: React.FC<BusinessPageHeaderProps> = ({ content }) => {
  const { 
    title = "Business Name",
    subtitle = "Welcome to our business page",
    backgroundImage,
    logo,
    buttonText = "Contact Us",
    buttonLink = "#contact"
  } = content;

  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/50 z-0"></div>
        </div>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          {logo && (
            <div className="mb-6">
              <img 
                src={logo} 
                alt="Business Logo" 
                className="h-24 w-auto object-contain"
              />
            </div>
          )}
          
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${backgroundImage ? 'text-white' : ''}`}>
            {title}
          </h1>
          
          <p className={`text-xl md:text-2xl mb-8 max-w-2xl ${backgroundImage ? 'text-white' : 'text-muted-foreground'}`}>
            {subtitle}
          </p>
          
          {buttonText && (
            <a 
              href={buttonLink} 
              className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default BusinessPageHeader;
