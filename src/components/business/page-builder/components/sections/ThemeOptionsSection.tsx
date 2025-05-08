
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useBusinessPage, FontStyle } from "../../context/BusinessPageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorInput } from "@/components/inputs/ColorInput";

export const ThemeOptionsSection = () => {
  const { pageData, updateSectionData } = useBusinessPage();
  const { backgroundColor, textColor, fontStyle } = pageData.theme;

  const handleFontStyleChange = (value: string) => {
    if (value as FontStyle) {
      updateSectionData("theme", { fontStyle: value as FontStyle });
    }
  };

  const handleBackgroundColorChange = (color: string) => {
    updateSectionData("theme", { backgroundColor: color });
  };

  const handleTextColorChange = (color: string) => {
    updateSectionData("theme", { textColor: color });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">7. Theme Options</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bg-color">Page Background Color</Label>
            <ColorInput
              id="bg-color"
              value={backgroundColor}
              onChange={handleBackgroundColorChange}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="text-color">Text Color</Label>
            <ColorInput
              id="text-color"
              value={textColor}
              onChange={handleTextColorChange}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="font-style">Font Style</Label>
            <Select 
              value={fontStyle} 
              onValueChange={handleFontStyleChange}
            >
              <SelectTrigger id="font-style">
                <SelectValue placeholder="Select font style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sans-serif">Sans Serif</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="monospace">Monospace</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
