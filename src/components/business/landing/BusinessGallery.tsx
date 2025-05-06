
import React from "react";
import { BusinessPageSection } from "@/types/business.types";

interface BusinessGalleryProps {
  section: BusinessPageSection;
}

const BusinessGallery = ({ section }: BusinessGalleryProps) => {
  const content = section.section_content || {};
  
  const {
    title = "Gallery",
    description = "",
    images = [],
    columns = 3,
    layout = "grid", 
    imageFit = "cover",
    showCaption = false
  } = content;
  
  if (!images || images.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && <p className="text-lg text-muted-foreground">{description}</p>}
          </div>
          <div className="text-center text-muted-foreground">
            No images available in the gallery.
          </div>
        </div>
      </section>
    );
  }
  
  const getColumnsClass = () => {
    switch (columns) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-1 md:grid-cols-2";
      case 4: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
      case 5: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5";
      case 6: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6";
      default: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
    }
  };
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          {description && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>}
        </div>
        
        {layout === "cards" ? (
          <div className={`grid ${getColumnsClass()} gap-6`}>
            {images.map((image: any, index: number) => (
              <div key={index} className="group rounded-lg overflow-hidden bg-card border shadow-sm">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={image.url} 
                    alt={image.alt || `Gallery image ${index + 1}`} 
                    className={`w-full h-full object-${imageFit} transition-transform duration-300 group-hover:scale-105`}
                  />
                </div>
                
                {(showCaption && image.caption) && (
                  <div className="p-4">
                    <h3 className="font-medium text-base">{image.alt || `Image ${index + 1}`}</h3>
                    <p className="text-muted-foreground mt-1">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : layout === "masonry" ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {images.map((image: any, index: number) => (
              <div key={index} className="break-inside-avoid">
                <img 
                  src={image.url} 
                  alt={image.alt || `Gallery image ${index + 1}`} 
                  className={`w-full rounded-lg shadow-sm object-${imageFit}`}
                />
                {(showCaption && image.caption) && (
                  <div className="mt-2 mb-4">
                    <p className="text-sm text-muted-foreground">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid ${getColumnsClass()} gap-6`}>
            {images.map((image: any, index: number) => (
              <div key={index} className="relative group overflow-hidden rounded-full shadow-sm">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={image.url} 
                    alt={image.alt || `Gallery image ${index + 1}`} 
                    className={`w-full h-full object-${imageFit} transition-transform duration-300 group-hover:scale-105`}
                  />
                </div>
                {(showCaption && image.caption) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessGallery;
