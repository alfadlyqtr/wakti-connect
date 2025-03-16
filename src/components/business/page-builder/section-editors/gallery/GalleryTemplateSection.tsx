
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSectionTemplates } from "@/hooks/useSectionTemplates";

interface GalleryTemplateSectionProps {
  contentData: Record<string, any>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const GalleryTemplateSection: React.FC<GalleryTemplateSectionProps> = ({
  contentData,
  handleInputChange
}) => {
  const { templates } = useSectionTemplates('gallery');
  
  const applyTemplate = (templateContent: any) => {
    // Apply template properties selectively, preserving existing images
    if (templateContent.title) {
      handleInputChange({
        target: {
          name: 'title',
          value: templateContent.title
        }
      } as React.ChangeEvent<HTMLInputElement>);
    }
    
    if (templateContent.layout) {
      handleInputChange({
        target: {
          name: 'layout',
          value: templateContent.layout
        }
      } as React.ChangeEvent<HTMLInputElement>);
    }
    
    if (templateContent.showCaptions !== undefined) {
      handleInputChange({
        target: {
          name: 'showCaptions',
          value: templateContent.showCaptions
        }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };
  
  if (!templates || templates.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-2">
      <Label>Quick Templates</Label>
      <div className="flex flex-wrap gap-2">
        {templates.map(template => (
          <Button 
            key={template.id} 
            variant="outline" 
            size="sm"
            onClick={() => applyTemplate(template.template_content)}
          >
            {template.template_name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GalleryTemplateSection;
