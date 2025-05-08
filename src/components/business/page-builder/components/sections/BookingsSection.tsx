
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Grid2X2, List } from "lucide-react";
import { useBusinessPage, ViewStyle } from "../../context/BusinessPageContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Mock booking templates for demo
const mockTemplates = [
  { id: "1", name: "30 Minute Consultation" },
  { id: "2", name: "1 Hour Service" },
  { id: "3", name: "Custom Booking" },
];

export const BookingsSection = () => {
  const { pageData, updateSectionData } = useBusinessPage();
  const { visible, viewStyle } = pageData.bookings;

  const handleViewStyleChange = (value: string) => {
    if (value as ViewStyle) {
      updateSectionData("bookings", { viewStyle: value as ViewStyle });
    }
  };

  const toggleVisibility = () => {
    updateSectionData("bookings", { visible: !visible });
  };

  // Add a template to the bookings section
  const handleAddTemplate = (id: string) => {
    const template = mockTemplates.find(t => t.id === id);
    if (template) {
      const currentTemplates = pageData.bookings.templates || [];
      if (!currentTemplates.some(t => t.id === id)) {
        const updatedTemplates = [...currentTemplates, template];
        updateSectionData("bookings", { templates: updatedTemplates });
      }
    }
  };

  // Remove a template from the bookings section
  const handleRemoveTemplate = (id: string) => {
    const currentTemplates = pageData.bookings.templates || [];
    const updatedTemplates = currentTemplates.filter(t => t.id !== id);
    updateSectionData("bookings", { templates: updatedTemplates });
  };

  return (
    <Card className="relative">
      <div className="absolute left-0 top-0 bottom-0 flex items-center px-2 cursor-move">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <CardHeader className="pl-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">3. Wakti Bookings</CardTitle>
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
            <Label>View Style</Label>
            <ToggleGroup 
              type="single" 
              value={viewStyle}
              onValueChange={handleViewStyleChange}
              className="flex justify-start"
            >
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <Grid2X2 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="dropdown" aria-label="Dropdown view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <Label>Add Booking Template</Label>
            <Select onValueChange={handleAddTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {mockTemplates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {pageData.bookings.templates && pageData.bookings.templates.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Templates</Label>
              <div className="space-y-2">
                {pageData.bookings.templates.map(template => (
                  <div key={template.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span>{template.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveTemplate(template.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
