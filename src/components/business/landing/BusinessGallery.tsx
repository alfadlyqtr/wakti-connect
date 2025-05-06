
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import { Card, CardContent } from "@/components/ui/card";

interface BusinessGalleryProps {
  section: BusinessPageSection;
  businessPage: any;
}

const BusinessGallery = ({ section, businessPage }: BusinessGalleryProps) => {
  const content = section.section_content || {};
  const images = Array.isArray(content.images) ? content.images : [];
  const title = content.title || "Gallery";
  const subtitle = content.subtitle || "Our Work";
  
  // Default styling
  const styles = {
    backgroundColor: section.background_color || "",
    color: section.text_color || "",
    padding: 
      section.padding === 'none' ? '0' : 
      section.padding === 'sm' ? '1rem' : 
      section.padding === 'md' ? '2rem' : 
      section.padding === 'lg' ? '3rem' : 
      section.padding === 'xl' ? '4rem' : '2rem',
  };
  
  // If there are no images, return an empty container
  if (images.length === 0) {
    return <div style={styles} className="my-8"></div>;
  }
  
  return (
    <div style={styles} className="my-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {images.map((image: any, index: number) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-square w-full relative">
                <img 
                  src={image.url} 
                  alt={image.caption || `Gallery image ${index + 1}`}
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                  loading="lazy"
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                    {image.caption}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BusinessGallery;
