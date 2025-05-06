
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
    <section className="py-6 md:py-10"> {/* Reduced padding */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-6"> {/* Reduced margin */}
          <h2 className="text-3xl font-bold mb-2">{title}</h2> {/* Reduced margin */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
        
        {layout === "cards" ? (
          // Card Layout
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-3`}> {/* Reduced gap */}
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
                  <div className="p-3"> {/* Reduced padding */}
                    <h3 className="font-medium text-base">{image.alt || `Image ${index + 1}`}</h3> {/* Reduced font size */}
                    <p className="text-muted-foreground mt-1 text-sm">{image.caption}</p> {/* Reduced font size */}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : layout === "masonry" ? (
          // Masonry Layout
          <div className="columns-1 md:columns-2 lg:columns-3 gap-3 space-y-3"> {/* Reduced gap and spacing */}
            {images.map((image: any, index: number) => (
              <div key={index} className="break-inside-avoid">
                <img 
                  src={image.url} 
                  alt={image.alt || `Gallery image ${index + 1}`} 
                  className={`w-full rounded-lg shadow-sm object-${imageFit}`}
                />
                {(showCaption && image.caption) && (
                  <div className="mt-1 mb-2"> {/* Reduced margin */}
                    <p className="text-xs text-muted-foreground">{image.caption}</p> {/* Reduced font size */}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Default Grid Layout
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-3`}> {/* Reduced gap */}
            {images.map((image: any, index: number) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-sm group relative">
                <img 
                  src={image.url} 
                  alt={image.alt || `Gallery image ${index + 1}`} 
                  className={`w-full h-full object-${imageFit} transition-transform group-hover:scale-105 duration-300 max-h-[250px]`} /* Reduced max-height */
                />
                {(showCaption && image.caption) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-xs">{image.caption}</p> {/* Reduced font size */}
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
