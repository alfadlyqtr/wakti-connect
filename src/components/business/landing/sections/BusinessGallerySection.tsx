
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
    layout = "grid", // grid, cards, masonry
    imageFit = "cover",
    showCaption = false,
    backgroundColor,
    textColor,
    textAlignment = "center"
  } = content;
  
  if (!images || images.length === 0) {
    return null;
  }
  
  const sectionStyles = {
    backgroundColor: backgroundColor || undefined,
    color: textColor || undefined
  };
  
  const textAlignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  }[textAlignment] || "text-center";
  
  return (
    <section className="py-12 md:py-16" style={sectionStyles}>
      <div className="container mx-auto px-4">
        <div className={`${textAlignmentClass} mb-10`}>
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
        
        {layout === "cards" ? (
          // Card Layout
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
            {images.map((image: any, index: number) => (
              <div key={index} className="group rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                {/* Image container with fixed aspect ratio */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={image.url} 
                    alt={image.alt || `Gallery image ${index + 1}`} 
                    className={`w-full h-full object-${imageFit} transition-transform group-hover:scale-105 duration-300`}
                  />
                </div>
                
                {/* Caption area */}
                {(showCaption && image.caption) && (
                  <div className="p-4">
                    <h3 className="font-medium text-lg">{image.alt || `Image ${index + 1}`}</h3>
                    <p className="text-muted-foreground mt-1">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : layout === "masonry" ? (
          // Masonry Layout
          <div className={`columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4`}>
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
          // Default Grid Layout
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-4`}>
            {images.map((image: any, index: number) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-sm group">
                <img 
                  src={image.url} 
                  alt={image.alt || `Gallery image ${index + 1}`} 
                  className={`w-full h-full object-${imageFit} transition-transform group-hover:scale-105 duration-300`}
                />
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

export default BusinessGallerySection;
