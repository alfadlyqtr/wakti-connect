
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface BusinessGalleryProps {
  section: BusinessPageSection;
}

const BusinessGallery = ({ section }: BusinessGalleryProps) => {
  const { t } = useTranslation();
  const content = section.section_content || {};
  
  const {
    title = "Gallery",
    images = []
  } = content;
  
  if (!images || images.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">{t("business.noImages")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image: any, index: number) => (
          <div 
            key={index} 
            className="aspect-square rounded-lg overflow-hidden bg-muted"
          >
            <img 
              src={image.url} 
              alt={image.alt || `Gallery image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessGallery;
