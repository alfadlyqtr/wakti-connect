
import React from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Rows, Columns, Grid3X3 } from "lucide-react";
import { EditorProps } from "../types";

interface GalleryLayoutTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  columns: number;
  imageFit: string;
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
      columns: 3,
      imageFit: "cover"
    },
    {
      id: "grid-2-cover",
      name: "Grid (2 columns)",
      icon: <Columns className="h-5 w-5" />,
      columns: 2,
      imageFit: "cover"
    },
    {
      id: "grid-4-cover",
      name: "Gallery (4 columns)",
      icon: <LayoutGrid className="h-5 w-5" />,
      columns: 4,
      imageFit: "cover"
    },
    {
      id: "list-1-contain",
      name: "List View",
      icon: <Rows className="h-5 w-5" />,
      columns: 1,
      imageFit: "contain"
    }
  ];
  
  // Apply a template
  const handleSelectTemplate = (template: GalleryLayoutTemplate) => {
    // Create a synthetic event to update the content data
    const changes = {
      columns: template.columns,
      imageFit: template.imageFit
    };
    
    // Update each property
    Object.entries(changes).forEach(([key, value]) => {
      handleInputChange({
        target: {
          name: key,
          value: value
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });
  };
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Gallery Layout Templates</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {templates.map((template) => (
          <Button
            key={template.id}
            variant="outline"
            className={`flex flex-col h-auto py-4 ${
              contentData.columns === template.columns && 
              contentData.imageFit === template.imageFit
                ? "border-primary bg-primary/5"
                : ""
            }`}
            onClick={() => handleSelectTemplate(template)}
          >
            <div className="mb-2">{template.icon}</div>
            <span className="text-xs">{template.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GalleryTemplateSection;
