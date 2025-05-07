
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  LayoutGrid, 
  Rows, 
  Columns, 
  Grid3X3, 
  Images, 
  FileImage, 
  SlidersHorizontal
} from "lucide-react";
import { EditorProps } from "../types";

interface LayoutOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  value: string;
}

interface ColumnOption {
  value: number;
  name: string;
  icon: React.ReactNode;
}

const GalleryTemplateSection: React.FC<EditorProps> = ({
  contentData,
  handleInputChange
}) => {
  // Layout options with clear visual cues
  const layoutOptions: LayoutOption[] = [
    {
      id: "grid-layout",
      name: "Grid",
      icon: <Grid3X3 className="h-5 w-5" />,
      value: "grid",
    },
    {
      id: "cards-layout",
      name: "Cards",
      icon: <FileImage className="h-5 w-5" />,
      value: "cards",
    },
    {
      id: "masonry-layout",
      name: "Masonry",
      icon: <Images className="h-5 w-5" />,
      value: "masonry",
    },
    {
      id: "carousel-layout",
      name: "Carousel",
      icon: <SlidersHorizontal className="h-5 w-5" />,
      value: "carousel",
    }
  ];
  
  // Column number options (2, 4, or 6 images)
  const columnOptions: ColumnOption[] = [
    {
      value: 2,
      name: "2 Columns",
      icon: <Columns className="h-5 w-5" />,
    },
    {
      value: 3,
      name: "3 Columns",
      icon: <Grid3X3 className="h-5 w-5" />
    },
    {
      value: 4,
      name: "4 Columns",
      icon: <LayoutGrid className="h-5 w-5" />
    }
  ];
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Gallery Layout</label>
        <div className="grid grid-cols-4 gap-3">
          {layoutOptions.map((option) => (
            <Button
              key={option.id}
              variant={contentData.layout === option.value ? "default" : "outline"}
              size="sm"
              className={`flex flex-col h-auto py-2 px-1`}
              onClick={() => handleInputChange("layout", option.value)}
            >
              <div className="mb-1">{option.icon}</div>
              <span className="text-xs">{option.name}</span>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Number of Images Per Row</label>
        <div className="grid grid-cols-3 gap-3">
          {columnOptions.map((option) => (
            <Button
              key={option.value}
              variant={contentData.columns === option.value ? "default" : "outline"}
              size="sm" 
              className="flex flex-col h-auto py-2"
              onClick={() => handleInputChange("columns", option.value)}
            >
              <div className="mb-1">{option.icon}</div>
              <span className="text-xs">{option.name}</span>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Show Image Captions</label>
          <Button
            variant={contentData.showCaption ? "default" : "outline"}
            size="sm"
            onClick={() => handleInputChange("showCaption", !contentData.showCaption)}
          >
            {contentData.showCaption ? "On" : "Off"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GalleryTemplateSection;
