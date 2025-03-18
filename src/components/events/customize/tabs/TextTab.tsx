
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCustomization } from "@/types/event.types";
import FontSelector from "../FontSelector";

interface TextTabProps {
  customization: EventCustomization;
  onFontChange: (property: 'family' | 'size' | 'color' | 'weight' | 'alignment', value: string) => void;
  onHeaderFontChange?: (property: 'family' | 'size' | 'color' | 'weight', value: string) => void;
  onDescriptionFontChange?: (property: 'family' | 'size' | 'color' | 'weight', value: string) => void;
  onDateTimeFontChange?: (property: 'family' | 'size' | 'color' | 'weight', value: string) => void;
}

const TextTab: React.FC<TextTabProps> = ({
  customization,
  onFontChange,
  onHeaderFontChange,
  onDescriptionFontChange,
  onDateTimeFontChange
}) => {
  const [activeTab, setActiveTab] = useState("main");

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="main">Main Text</TabsTrigger>
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="datetime">Date & Time</TabsTrigger>
        </TabsList>
        
        <TabsContent value="main" className="pt-4">
          <div className="mb-4 p-3 bg-muted/30 rounded-md text-sm">
            These settings apply to all text by default, but can be overridden in the specific tabs.
          </div>
          <FontSelector 
            font={customization.font}
            onFontChange={onFontChange}
            showAlignment={true}
            showWeight={true}
          />
        </TabsContent>
        
        <TabsContent value="header" className="pt-4">
          <div className="mb-4 p-3 bg-muted/30 rounded-md text-sm">
            Customize the title font separately from the main text.
          </div>
          <FontSelector 
            font={{
              family: customization.headerFont?.family || customization.font.family,
              size: customization.headerFont?.size || customization.font.size,
              color: customization.headerFont?.color || customization.font.color,
              weight: customization.headerFont?.weight || customization.font.weight || 'normal'
            }}
            onFontChange={(property, value) => onHeaderFontChange && onHeaderFontChange(property, value)}
            showAlignment={false}
            showWeight={true}
            previewText={customization.headerFont?.family ? "Custom Header Font" : "Using Default Font"}
          />
        </TabsContent>
        
        <TabsContent value="description" className="pt-4">
          <div className="mb-4 p-3 bg-muted/30 rounded-md text-sm">
            Customize the description text separately.
          </div>
          <FontSelector 
            font={{
              family: customization.descriptionFont?.family || customization.font.family,
              size: customization.descriptionFont?.size || customization.font.size,
              color: customization.descriptionFont?.color || customization.font.color,
              weight: customization.descriptionFont?.weight || customization.font.weight || 'normal'
            }}
            onFontChange={(property, value) => onDescriptionFontChange && onDescriptionFontChange(property, value)}
            showAlignment={false}
            showWeight={true}
            previewText={customization.descriptionFont?.family ? "Custom Description Font" : "Using Default Font"}
          />
        </TabsContent>
        
        <TabsContent value="datetime" className="pt-4">
          <div className="mb-4 p-3 bg-muted/30 rounded-md text-sm">
            Customize the date and time text separately.
          </div>
          <FontSelector 
            font={{
              family: customization.dateTimeFont?.family || customization.font.family,
              size: customization.dateTimeFont?.size || customization.font.size,
              color: customization.dateTimeFont?.color || customization.font.color,
              weight: customization.dateTimeFont?.weight || customization.font.weight || 'normal'
            }}
            onFontChange={(property, value) => onDateTimeFontChange && onDateTimeFontChange(property, value)}
            showAlignment={false}
            showWeight={true}
            previewText={customization.dateTimeFont?.family ? "Custom Date/Time Font" : "Using Default Font"}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TextTab;
