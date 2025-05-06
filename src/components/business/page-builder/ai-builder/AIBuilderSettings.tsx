
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { BusinessPage } from "@/types/business.types";

interface AIBuilderSettingsProps {
  businessPage: BusinessPage;
}

const AIBuilderSettings: React.FC<AIBuilderSettingsProps> = ({ businessPage }) => {
  // Generate a view URL based on the business page slug
  const getViewUrl = () => {
    if (!businessPage.page_slug) return '#';
    return `${window.location.origin}/${businessPage.page_slug}`;
  };

  const openPageInNewTab = () => {
    const url = getViewUrl();
    if (url !== '#') {
      window.open(url, '_blank');
    }
  };

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

        <Separator />

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-medium text-blue-800">Your Business Page</h3>
          <p className="text-sm text-blue-700 mt-1 mb-3">
            Share your business page with customers at:
          </p>
          <div className="bg-white p-3 rounded border border-blue-200 font-mono text-sm break-all">
            {getViewUrl() === '#' ? 'No page URL available - set a page slug first' : getViewUrl()}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={openPageInNewTab} 
          disabled={getViewUrl() === '#'}
          variant="default"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View Page
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIBuilderSettings;
