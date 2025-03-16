
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AppearanceSettingsTabProps {
  pageData: {
    primary_color: string;
    secondary_color: string;
  };
  handleInputChangeWithAutoSave: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AppearanceSettingsTab: React.FC<AppearanceSettingsTabProps> = ({
  pageData,
  handleInputChangeWithAutoSave
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>
          Customize the look and feel of your business page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primary_color">Primary Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="primary_color"
                name="primary_color"
                type="color"
                value={pageData.primary_color}
                onChange={handleInputChangeWithAutoSave}
                className="w-12 h-9 p-1"
              />
              <Input
                type="text"
                value={pageData.primary_color}
                onChange={handleInputChangeWithAutoSave}
                name="primary_color"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secondary_color">Secondary Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="secondary_color"
                name="secondary_color"
                type="color"
                value={pageData.secondary_color}
                onChange={handleInputChangeWithAutoSave}
                className="w-12 h-9 p-1"
              />
              <Input
                type="text"
                value={pageData.secondary_color}
                onChange={handleInputChangeWithAutoSave}
                name="secondary_color"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettingsTab;
