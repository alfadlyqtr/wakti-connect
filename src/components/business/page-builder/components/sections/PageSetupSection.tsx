
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { GripVertical } from "lucide-react";
import { useBusinessPage } from "../../context/BusinessPageContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const PageSetupSection = () => {
  const { pageData, updateSectionData } = useBusinessPage();
  const { businessName, alignment, visible } = pageData.pageSetup;

  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSectionData("pageSetup", { businessName: e.target.value });
  };

  const handleAlignmentChange = (value: string) => {
    if (value) {
      updateSectionData("pageSetup", { alignment: value as "left" | "center" | "right" });
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
            <Label htmlFor="businessName">Page Title</Label>
            <Input 
              id="businessName" 
              value={businessName} 
              onChange={handleBusinessNameChange} 
              placeholder="Enter your business name"
            />
          </div>

          <div className="space-y-2">
            <Label>Text Alignment</Label>
            <ToggleGroup 
              type="single" 
              value={alignment} 
              onValueChange={handleAlignmentChange}
              className="justify-start"
            >
              <ToggleGroupItem value="left" aria-label="Align left">
                Left
              </ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center">
                Center
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right">
                Right
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
