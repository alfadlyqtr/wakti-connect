
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GripVertical, AlignLeft, AlignCenter, AlignRight, Square, Circle } from "lucide-react";
import { useBusinessPage, TextAlignment, LogoShape } from "../../context/BusinessPageContext";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const LogoSection = () => {
  const { pageData, updateSectionData } = useBusinessPage();
  const { url, shape, alignment, visible } = pageData.logo;

  const handleAlignmentChange = (value: string) => {
    if (value as TextAlignment) {
      updateSectionData("logo", { alignment: value as TextAlignment });
    }
  };

  const handleShapeChange = (value: string) => {
    if (value as LogoShape) {
      updateSectionData("logo", { shape: value as LogoShape });
    }
  };

  const toggleVisibility = () => {
    updateSectionData("logo", { visible: !visible });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateSectionData("logo", { url: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="relative">
      <div className="absolute left-0 top-0 bottom-0 flex items-center px-2 cursor-move">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <CardHeader className="pl-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">2. Upload Logo</CardTitle>
          <Switch 
            checked={visible} 
            onCheckedChange={toggleVisibility}
            aria-label="Toggle visibility"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo-upload">Upload Logo</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById("logo-upload")?.click()}
              >
                {url ? "Change Logo" : "Upload Logo"}
              </Button>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>
            {url && (
              <div className="mt-2 flex justify-center">
                <img 
                  src={url}
                  alt="Logo Preview" 
                  className={`max-h-20 max-w-full ${shape === 'circle' ? 'rounded-full' : ''}`}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Logo Shape</Label>
            <ToggleGroup 
              type="single" 
              value={shape}
              onValueChange={handleShapeChange}
              className="flex justify-start"
            >
              <ToggleGroupItem value="square" aria-label="Square logo">
                <Square className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="circle" aria-label="Circle logo">
                <Circle className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <Label>Logo Alignment</Label>
            <ToggleGroup 
              type="single" 
              value={alignment}
              onValueChange={handleAlignmentChange}
              className="flex justify-start"
            >
              <ToggleGroupItem value="left" aria-label="Left align">
                <AlignLeft className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Center align">
                <AlignCenter className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Right align">
                <AlignRight className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
