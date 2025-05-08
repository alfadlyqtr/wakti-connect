
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GripVertical, GalleryHorizontal, List } from "lucide-react";
import { useBusinessPage, LayoutOption } from "../../context/BusinessPageContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const WorkingHoursSection = () => {
  const { pageData, updateSectionData } = useBusinessPage();
  const { visible, layout } = pageData.workingHours;

  const toggleVisibility = () => {
    updateSectionData("workingHours", { visible: !visible });
  };

  const handleLayoutChange = (value: string) => {
    if (value as LayoutOption) {
      updateSectionData("workingHours", { layout: value as LayoutOption });
    }
  };

  return (
    <Card className="relative">
      <div className="absolute left-0 top-0 bottom-0 flex items-center px-2 cursor-move">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <CardHeader className="pl-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">5. Working Hours</CardTitle>
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
            <Label>Layout Style</Label>
            <ToggleGroup 
              type="single" 
              value={layout}
              onValueChange={handleLayoutChange}
              className="flex justify-start"
            >
              <ToggleGroupItem value="card" aria-label="Card view">
                <GalleryHorizontal className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="line" aria-label="Line view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="p-2 bg-muted rounded text-sm">
            <p>Working hours can be set in the Landing Page Settings</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
