import React from "react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ColorPickerInput } from "../inputs/ColorPickerInput";
import { TextAlign } from "@/types/event.types";

// Define font properties interface
export interface FontProps {
  family: string;
  size: string;
  color: string;
  weight?: string;
  alignment?: TextAlign;
}

interface TextTabProps {
  font: FontProps;
  headerFont?: FontProps;
  descriptionFont?: FontProps;
  dateTimeFont?: FontProps;
  onFontChange: (property: "family" | "size" | "color" | "weight" | "alignment", value: string) => void;
  onHeaderFontChange: (property: "family" | "size" | "color" | "weight", value: string) => void;
  onDescriptionFontChange: (property: "family" | "size" | "color" | "weight", value: string) => void;
  onDateTimeFontChange: (property: "family" | "size" | "color" | "weight", value: string) => void;
}

// Font family options
const fontFamilies = [
  { value: "system-ui, sans-serif", label: "System UI" },
  { value: "'Arial', sans-serif", label: "Arial" },
  { value: "'Helvetica', sans-serif", label: "Helvetica" },
  { value: "'Georgia', serif", label: "Georgia" },
  { value: "'Verdana', sans-serif", label: "Verdana" },
  { value: "'Roboto', sans-serif", label: "Roboto" },
  { value: "'Montserrat', sans-serif", label: "Montserrat" },
  { value: "'Open Sans', sans-serif", label: "Open Sans" },
];

// Font size options
const fontSizes = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "xlarge", label: "Extra Large" },
];

// Font weight options
const fontWeights = [
  { value: "light", label: "Light" },
  { value: "normal", label: "Normal" },
  { value: "medium", label: "Medium" },
  { value: "bold", label: "Bold" },
];

// Text align options
const textAligns = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
  { value: "justify", label: "Justify" },
];

const TextTab: React.FC<TextTabProps> = ({
  font,
  headerFont,
  descriptionFont,
  dateTimeFont,
  onFontChange,
  onHeaderFontChange,
  onDescriptionFontChange,
  onDateTimeFontChange,
}) => {
  // Ensure we have valid font objects with defaults
  const ensuredFont: FontProps = {
    family: font?.family || "system-ui, sans-serif",
    size: font?.size || "medium",
    color: font?.color || "#333333",
    weight: font?.weight || "normal",
    alignment: font?.alignment || "left"
  };

  const ensuredHeaderFont = headerFont || ensuredFont;
  const ensuredDescriptionFont = descriptionFont || ensuredFont;
  const ensuredDateTimeFont = dateTimeFont || ensuredFont;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">General Text</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Customize the appearance of your event text
        </p>

        <div className="space-y-4">
          <div>
            <Label>Font Family</Label>
            <Select onValueChange={(value) => onFontChange("family", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Font Size</Label>
            <Select onValueChange={(value) => onFontChange("size", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Font Weight</Label>
            <Select onValueChange={(value) => onFontChange("weight", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a weight" />
              </SelectTrigger>
              <SelectContent>
                {fontWeights.map((weight) => (
                  <SelectItem key={weight.value} value={weight.value}>
                    {weight.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Text Color</Label>
            <ColorPickerInput
              value={ensuredFont.color}
              onChange={(value) => onFontChange("color", value)}
            />
          </div>

          <div>
            <Label>Text Alignment</Label>
            <Select onValueChange={(value) => onFontChange("alignment", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select alignment" />
              </SelectTrigger>
              <SelectContent>
                {textAligns.map((align) => (
                  <SelectItem key={align.value} value={align.value}>
                    {align.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextTab;
