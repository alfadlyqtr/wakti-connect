
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { GripVertical, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { useBusinessPage, TextAlignment } from "../../context/BusinessPageContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const PageSetupSection = () => {
  const { pageData, updateSectionData } = useBusinessPage();
  const { businessName, alignment, visible } = pageData.pageSetup;

  const handleAlignmentChange = (value: string) => {
    if (value as TextAlignment) {
      updateSectionData("pageSetup", { alignment: value as TextAlignment });
    }
  };

  const toggleVisibility = () => {
    updateSectionData("pageSetup", { visible: !visible });
  };

  return (
    <Card className="relative">
      <div className="absolute left-0 top-0 bottom-0 flex items-center px-2 cursor-move">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <CardHeader className="pl-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">1. Page Setup</CardTitle>
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
            <Label htmlFor="business-name">Business Name</Label>
            <Input 
              id="business-name" 
              value={businessName} 
              onChange={(e) => updateSectionData("pageSetup", { businessName: e.target.value })}
              placeholder="Enter your business name"
            />
          </div>

          <div className="space-y-2">
            <Label>Text Alignment</Label>
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
