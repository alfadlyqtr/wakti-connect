
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextColorPicker } from '../inputs/TextColorPicker';

interface TextTabProps {
  font: {
    family: string;
    size: string;
    color: string;
    weight?: string;
    alignment?: string;
  };
  headerFont?: {
    family: string;
    size: string;
    color: string;
    weight?: string;
  };
  descriptionFont?: {
    family: string;
    size: string;
    color: string;
    weight?: string;
  };
  dateTimeFont?: {
    family: string;
    size: string;
    color: string;
    weight?: string;
  };
  onFontChange: (property: 'family' | 'size' | 'color' | 'weight' | 'alignment', value: string) => void;
  onHeaderFontChange: (property: 'family' | 'size' | 'color' | 'weight', value: string) => void;
  onDescriptionFontChange: (property: 'family' | 'size' | 'color' | 'weight', value: string) => void;
  onDateTimeFontChange: (property: 'family' | 'size' | 'color' | 'weight', value: string) => void;
}

const TextTab: React.FC<TextTabProps> = ({
  font,
  headerFont = { family: font.family, size: 'large', color: font.color, weight: 'semibold' },
  descriptionFont = { family: font.family, size: 'medium', color: font.color, weight: 'normal' },
  dateTimeFont = { family: font.family, size: 'small', color: font.color, weight: 'normal' },
  onFontChange,
  onHeaderFontChange,
  onDescriptionFontChange,
  onDateTimeFontChange
}) => {
  // Available font families
  const fontFamilies = [
    { value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', label: 'System UI' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: 'Helvetica, sans-serif', label: 'Helvetica' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Courier New, monospace', label: 'Courier New' },
    { value: 'Times New Roman, serif', label: 'Times New Roman' },
    { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS' },
    { value: 'Impact, sans-serif', label: 'Impact' },
    { value: 'Comic Sans MS, cursive', label: 'Comic Sans MS' }
  ];
  
  // Font sizes
  const fontSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'x-large', label: 'Extra Large' }
  ];
  
  // Font weights
  const fontWeights = [
    { value: 'normal', label: 'Normal' },
    { value: 'medium', label: 'Medium' },
    { value: 'semibold', label: 'Semi-Bold' },
    { value: 'bold', label: 'Bold' },
    { value: 'light', label: 'Light' }
  ];
  
  // Text alignments
  const textAlignments = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
    { value: 'justify', label: 'Justify' }
  ];
  
  return (
    <Tabs defaultValue="global">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="global">Global</TabsTrigger>
        <TabsTrigger value="header">Header</TabsTrigger>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="datetime">Date/Time</TabsTrigger>
      </TabsList>
      
      <TabsContent value="global" className="space-y-4">
        <div>
          <Label>Font Family</Label>
          <Select
            value={font.family}
            onValueChange={(value) => onFontChange('family', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((fontFamily) => (
                <SelectItem 
                  key={fontFamily.label} 
                  value={fontFamily.value}
                  style={{ fontFamily: fontFamily.value }}
                >
                  {fontFamily.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Font Size</Label>
          <Select
            value={font.size}
            onValueChange={(value) => onFontChange('size', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map((fontSize) => (
                <SelectItem key={fontSize.value} value={fontSize.value}>
                  {fontSize.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Text Alignment</Label>
          <Select
            value={font.alignment || 'left'}
            onValueChange={(value) => onFontChange('alignment', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select alignment" />
            </SelectTrigger>
            <SelectContent>
              {textAlignments.map((alignment) => (
                <SelectItem key={alignment.value} value={alignment.value}>
                  {alignment.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <TextColorPicker 
          label="Text Color"
          value={font.color} 
          onChange={(value) => onFontChange('color', value)} 
        />
      </TabsContent>
      
      <TabsContent value="header" className="space-y-4">
        <div>
          <Label>Font Family</Label>
          <Select
            value={headerFont.family}
            onValueChange={(value) => onHeaderFontChange('family', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((fontFamily) => (
                <SelectItem 
                  key={fontFamily.label} 
                  value={fontFamily.value}
                  style={{ fontFamily: fontFamily.value }}
                >
                  {fontFamily.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Font Size</Label>
          <Select
            value={headerFont.size}
            onValueChange={(value) => onHeaderFontChange('size', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map((fontSize) => (
                <SelectItem key={fontSize.value} value={fontSize.value}>
                  {fontSize.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Font Weight</Label>
          <Select
            value={headerFont.weight || 'semibold'}
            onValueChange={(value) => onHeaderFontChange('weight', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select weight" />
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
        
        <TextColorPicker 
          label="Header Color"
          value={headerFont.color} 
          onChange={(value) => onHeaderFontChange('color', value)} 
        />
      </TabsContent>
      
      <TabsContent value="description" className="space-y-4">
        <div>
          <Label>Font Family</Label>
          <Select
            value={descriptionFont.family}
            onValueChange={(value) => onDescriptionFontChange('family', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((fontFamily) => (
                <SelectItem 
                  key={fontFamily.label} 
                  value={fontFamily.value}
                  style={{ fontFamily: fontFamily.value }}
                >
                  {fontFamily.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Font Size</Label>
          <Select
            value={descriptionFont.size}
            onValueChange={(value) => onDescriptionFontChange('size', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map((fontSize) => (
                <SelectItem key={fontSize.value} value={fontSize.value}>
                  {fontSize.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Font Weight</Label>
          <Select
            value={descriptionFont.weight || 'normal'}
            onValueChange={(value) => onDescriptionFontChange('weight', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select weight" />
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
        
        <TextColorPicker 
          label="Description Color"
          value={descriptionFont.color} 
          onChange={(value) => onDescriptionFontChange('color', value)} 
        />
      </TabsContent>
      
      <TabsContent value="datetime" className="space-y-4">
        <div>
          <Label>Font Family</Label>
          <Select
            value={dateTimeFont.family}
            onValueChange={(value) => onDateTimeFontChange('family', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((fontFamily) => (
                <SelectItem 
                  key={fontFamily.label} 
                  value={fontFamily.value}
                  style={{ fontFamily: fontFamily.value }}
                >
                  {fontFamily.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Font Size</Label>
          <Select
            value={dateTimeFont.size}
            onValueChange={(value) => onDateTimeFontChange('size', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map((fontSize) => (
                <SelectItem key={fontSize.value} value={fontSize.value}>
                  {fontSize.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Font Weight</Label>
          <Select
            value={dateTimeFont.weight || 'normal'}
            onValueChange={(value) => onDateTimeFontChange('weight', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select weight" />
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
        
        <TextColorPicker 
          label="Date/Time Color"
          value={dateTimeFont.color} 
          onChange={(value) => onDateTimeFontChange('color', value)} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default TextTab;
