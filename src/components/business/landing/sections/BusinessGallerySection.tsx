
import React from "react";

interface BusinessGallerySectionProps {
  content: Record<string, any>;
}

const BusinessGallerySection: React.FC<BusinessGallerySectionProps> = ({ content }) => {
  const { 
    title = "Gallery",
    description = "Take a look at our work",
    images = [],
    columns = 3,
    imageFit = "cover"
  } = content;
  
  if (!images || images.length === 0) {
    return null;
  }
  
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
        
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-4`}>
          {images.map((image: string, index: number) => (
            <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-sm">
              <img 
                src={image} 
                alt={`Gallery image ${index + 1}`} 
                className={`w-full h-full object-${imageFit} transition-transform hover:scale-105`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessGallerySection;
