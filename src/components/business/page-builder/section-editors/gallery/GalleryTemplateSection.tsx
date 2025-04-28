
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  LayoutGrid, 
  Rows, 
  Columns, 
  Grid3X3, 
  Images, 
  LayoutList, 
  FileImage
} from "lucide-react";
import { EditorProps } from "../types";

interface GalleryLayoutTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  layout: string;
  columns?: number;
  imageFit?: string;
  showCaption?: boolean;
}

const GalleryTemplateSection: React.FC<EditorProps> = ({
  contentData,
  handleInputChange
}) => {
  // Common gallery layout templates
  const templates: GalleryLayoutTemplate[] = [
    {
      id: "grid-3-cover",
      name: "Grid (3 columns)",
      icon: <Grid3X3 className="h-5 w-5" />,
      layout: "grid",
      columns: 3,
      imageFit: "cover",
      showCaption: false
    },
    {
      id: "grid-2-cover",
      name: "Grid (2 columns)",
      icon: <Columns className="h-5 w-5" />,
      layout: "grid",
      columns: 2,
      imageFit: "cover",
      showCaption: false
    },
    {
      id: "cards-3",
      name: "Cards (with captions)",
      icon: <FileImage className="h-5 w-5" />,
      layout: "cards",
      columns: 3,
      imageFit: "cover",
      showCaption: true
    },
    {
      id: "masonry",
      name: "Masonry Layout",
      icon: <Images className="h-5 w-5" />,
      layout: "masonry",
      imageFit: "cover",
      showCaption: true
    },
    {
      id: "grid-4-cover",
      name: "Gallery (4 columns)",
      icon: <LayoutGrid className="h-5 w-5" />,
      layout: "grid",
      columns: 4,
      imageFit: "cover",
      showCaption: false
    },
    {
      id: "list-1-contain",
      name: "List View",
      icon: <Rows className="h-5 w-5" />,
      layout: "grid",
      columns: 1,
      imageFit: "contain",
      showCaption: true
    }
  ];
  
  // Apply a template
  const handleSelectTemplate = (template: GalleryLayoutTemplate) => {
    // Create changes object to update the content data
    const changes = {
      layout: template.layout,
      columns: template.columns,
      imageFit: template.imageFit,
      showCaption: template.showCaption
    };
    
    // Update each property
    Object.entries(changes).forEach(([key, value]) => {
      if (value !== undefined) {
        handleInputChange(key, value);
      }
    });
  };
  
  // Helper function to check if a template is selected
  const isTemplateSelected = (template: GalleryLayoutTemplate) => {
    return (
      contentData.layout === template.layout &&
      (!template.columns || contentData.columns === template.columns) &&
      (!template.imageFit || contentData.imageFit === template.imageFit) &&
      (template.showCaption === undefined || contentData.showCaption === template.showCaption)
    );
  };
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Gallery Layout Templates</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {templates.map((template) => (
          <Button
            key={template.id}
            variant="outline"
            className={`flex flex-col h-auto py-4 ${
              isTemplateSelected(template)
                ? "border-primary bg-primary/5"
                : ""
            }`}
            onClick={() => handleSelectTemplate(template)}
          >
            <div className="mb-2">{template.icon}</div>
            <span className="text-xs text-center">{template.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GalleryTemplateSection;
