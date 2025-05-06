
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
    showCaption = false
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
        
        {layout === "cards" ? (
          // Card Layout - Smaller sizes
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-${columns} gap-3`}>
            {images.map((image: any, index: number) => (
              <div key={index} className="group rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                {/* Image container with fixed aspect ratio - reduced size */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={image.url} 
                    alt={image.alt || `Gallery image ${index + 1}`} 
                    className={`w-full h-full object-${imageFit} transition-transform group-hover:scale-105 duration-300`}
                  />
                </div>
                
                {/* Caption area */}
                {(showCaption && image.caption) && (
                  <div className="p-2 text-sm">
                    <h3 className="font-medium text-base">{image.alt || `Image ${index + 1}`}</h3>
                    <p className="text-muted-foreground text-xs mt-1">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : layout === "masonry" ? (
          // Masonry Layout - Smaller sizes
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 space-y-3">
            {images.map((image: any, index: number) => (
              <div key={index} className="break-inside-avoid">
                <img 
                  src={image.url} 
                  alt={image.alt || `Gallery image ${index + 1}`} 
                  className={`w-full rounded-lg shadow-sm object-${imageFit}`}
                />
                {(showCaption && image.caption) && (
                  <div className="mt-1 mb-2">
                    <p className="text-xs text-muted-foreground">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Default Grid Layout - Smaller sizes with more columns
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3`}>
            {images.map((image: any, index: number) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-sm group">
                <img 
                  src={image.url} 
                  alt={image.alt || `Gallery image ${index + 1}`} 
                  className={`w-full h-full object-${imageFit} transition-transform group-hover:scale-105 duration-300`}
                />
                {(showCaption && image.caption) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-1 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-xs">{image.caption}</p>
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
