
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomization } from "../context";
import { ColorPickerInput } from "../inputs/ColorPickerInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const fontFamilies = [
  { id: "inter", label: "Inter", value: 'Inter, sans-serif' },
  { id: "roboto", label: "Roboto", value: 'Roboto, sans-serif' },
  { id: "poppins", label: "Poppins", value: 'Poppins, sans-serif' },
  { id: "system", label: "System UI", value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
];

const fontSizes = [
  { id: "small", label: "Small" },
  { id: "medium", label: "Medium" },
  { id: "large", label: "Large" },
  { id: "xlarge", label: "Extra Large" },
];

const fontWeights = [
  { id: "light", label: "Light" },
  { id: "normal", label: "Normal" },
  { id: "medium", label: "Medium" },
  { id: "bold", label: "Bold" },
];

const textAlignments = [
  { id: "left", label: "Left" },
  { id: "center", label: "Center" },
  { id: "right", label: "Right" },
];

export interface FontProps {
  family: string;
  size: string;
  color: string;
  weight?: string;
  label?: string;
  handleFamilyChange: (value: string) => void;
  handleSizeChange: (value: string) => void;
  handleColorChange: (value: string) => void;
  handleWeightChange?: (value: string) => void;
}

const FontSection: React.FC<FontProps> = ({
  family,
  size,
  color,
  weight = "normal",
  label = "Font",
  handleFamilyChange,
  handleSizeChange,
  handleColorChange,
  handleWeightChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">{label}</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select value={family} onValueChange={handleFamilyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select font family" />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font.id} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Font Size</Label>
          <RadioGroup value={size} onValueChange={handleSizeChange} className="flex space-x-4">
            {fontSizes.map((fSize) => (
              <div key={fSize.id} className="flex items-center space-x-2">
                <RadioGroupItem value={fSize.id} id={`size-${fSize.id}`} />
                <Label htmlFor={`size-${fSize.id}`}>{fSize.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {handleWeightChange && (
          <div className="space-y-2">
            <Label>Font Weight</Label>
            <RadioGroup value={weight} onValueChange={handleWeightChange} className="flex space-x-4">
              {fontWeights.map((fWeight) => (
                <div key={fWeight.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={fWeight.id} id={`weight-${fWeight.id}`} />
                  <Label htmlFor={`weight-${fWeight.id}`}>{fWeight.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
        
        <div className="space-y-2">
          <Label>Text Color</Label>
          <ColorPickerInput value={color} onChange={handleColorChange} />
        </div>
      </div>
    </div>
  );
};

const TextTab = () => {
  const {
    customization,
    handleFontChange,
    handleHeaderFontChange,
    handleDescriptionFontChange,
    handleDateTimeFontChange,
  } = useCustomization();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="main">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="main">Main Text</TabsTrigger>
          <TabsTrigger value="title">Title</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="dateTime">Date & Time</TabsTrigger>
        </TabsList>
        
        <TabsContent value="main" className="space-y-4 pt-4">
          <FontSection
            family={customization.font.family}
            size={customization.font.size}
            color={customization.font.color}
            weight={customization.font.weight}
            handleFamilyChange={(value) => handleFontChange('family', value)}
            handleSizeChange={(value) => handleFontChange('size', value)}
            handleColorChange={(value) => handleFontChange('color', value)}
            handleWeightChange={(value) => handleFontChange('weight', value)}
            label="Main Font Settings"
          />
          
          <div className="space-y-2">
            <Label>Text Alignment</Label>
            <RadioGroup
              value={customization.font.alignment || 'left'}
              onValueChange={(value) => handleFontChange('alignment', value)}
              className="flex space-x-4"
            >
              {textAlignments.map((alignment) => (
                <div key={alignment.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={alignment.id} id={`alignment-${alignment.id}`} />
                  <Label htmlFor={`alignment-${alignment.id}`}>{alignment.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </TabsContent>
        
        <TabsContent value="title" className="space-y-4 pt-4">
          <FontSection
            family={customization.headerFont?.family || customization.font.family}
            size={customization.headerFont?.size || customization.font.size}
            color={customization.headerFont?.color || customization.font.color}
            weight={customization.headerFont?.weight || customization.font.weight}
            handleFamilyChange={(value) => handleHeaderFontChange('family', value)}
            handleSizeChange={(value) => handleHeaderFontChange('size', value)}
            handleColorChange={(value) => handleHeaderFontChange('color', value)}
            handleWeightChange={(value) => handleHeaderFontChange('weight', value)}
            label="Title Font Settings"
          />
        </TabsContent>
        
        <TabsContent value="description" className="space-y-4 pt-4">
          <FontSection
            family={customization.descriptionFont?.family || customization.font.family}
            size={customization.descriptionFont?.size || customization.font.size}
            color={customization.descriptionFont?.color || customization.font.color}
            weight={customization.descriptionFont?.weight || customization.font.weight}
            handleFamilyChange={(value) => handleDescriptionFontChange('family', value)}
            handleSizeChange={(value) => handleDescriptionFontChange('size', value)}
            handleColorChange={(value) => handleDescriptionFontChange('color', value)}
            handleWeightChange={(value) => handleDescriptionFontChange('weight', value)}
            label="Description Font Settings"
          />
        </TabsContent>
        
        <TabsContent value="dateTime" className="space-y-4 pt-4">
          <FontSection
            family={customization.dateTimeFont?.family || customization.font.family}
            size={customization.dateTimeFont?.size || customization.font.size}
            color={customization.dateTimeFont?.color || customization.font.color}
            weight={customization.dateTimeFont?.weight || customization.font.weight}
            handleFamilyChange={(value) => handleDateTimeFontChange('family', value)}
            handleSizeChange={(value) => handleDateTimeFontChange('size', value)}
            handleColorChange={(value) => handleDateTimeFontChange('color', value)}
            handleWeightChange={(value) => handleDateTimeFontChange('weight', value)}
            label="Date & Time Font Settings"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TextTab;
