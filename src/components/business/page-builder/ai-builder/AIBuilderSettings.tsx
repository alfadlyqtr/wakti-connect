
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BusinessPage } from "@/types/business.types";

interface AIBuilderSettingsProps {
  businessPage: BusinessPage;
}

const AIBuilderSettings: React.FC<AIBuilderSettingsProps> = ({ businessPage }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Builder Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="ai-content-preservation">Preserve existing content</Label>
            <Switch id="ai-content-preservation" defaultChecked />
          </div>
          <p className="text-sm text-muted-foreground">
            When enabled, AI will try to preserve your existing content when generating new sections
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="ai-style-consistency">Maintain style consistency</Label>
            <Switch id="ai-style-consistency" defaultChecked />
          </div>
          <p className="text-sm text-muted-foreground">
            When enabled, AI will use your brand colors and styling preferences
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="ai-section-overwrite">Allow section overwrite</Label>
            <Switch id="ai-section-overwrite" />
          </div>
          <p className="text-sm text-muted-foreground">
            When enabled, AI can replace existing sections with similar types
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIBuilderSettings;
