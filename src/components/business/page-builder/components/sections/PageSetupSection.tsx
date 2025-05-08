
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Save, InfoCircle } from "lucide-react";
import { useBusinessPage } from "../../context/BusinessPageContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const PageSetupSection = () => {
  const { pageData, updateSectionData, handleSave } = useBusinessPage();
  const { businessName, alignment, visible } = pageData.pageSetup;
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSectionData("pageSetup", { businessName: e.target.value });
    setIsDirty(true);
  };

  const handleAlignmentChange = (value: string) => {
    if (value) {
      updateSectionData("pageSetup", { alignment: value as "left" | "center" | "right" });
      setIsDirty(true);
    }
  };

  const toggleVisibility = () => {
    updateSectionData("pageSetup", { visible: !visible });
    setIsDirty(true);
  };

  const saveSection = async () => {
    setIsSaving(true);
    try {
      await handleSave();
      toast({
        title: "Section saved",
        description: "Page setup changes have been saved successfully"
      });
      setIsDirty(false);
    } catch (error) {
      console.error("Error saving section:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Failed to save page setup changes"
      });
    } finally {
      setIsSaving(false);
    }
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
            <div className="flex items-center gap-2">
              <Label htmlFor="businessName">Page Title</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Your Page Title is important as it determines your page URL.
                    Once published, changing it requires a special request.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input 
              id="businessName" 
              value={businessName} 
              onChange={handleBusinessNameChange} 
              placeholder="Enter your page title"
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

          <Button 
            onClick={saveSection} 
            disabled={isSaving || !isDirty} 
            size="sm"
            className="w-full"
            variant={isDirty ? "default" : "outline"}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4 animate-pulse" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isDirty ? "Save Changes" : "No Changes"}
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
