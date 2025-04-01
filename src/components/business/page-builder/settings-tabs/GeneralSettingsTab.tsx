
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import { BusinessPage } from "@/types/business.types";

interface GeneralSettingsTabProps {
  pageData: {
    page_title: string;
    page_slug: string;
    description: string;
    is_published: boolean;
    logo_url?: string;
  };
  handleInputChangeWithAutoSave: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleToggleWithAutoSave: (name: string, checked: boolean) => void;
  getPublicPageUrl: () => string;
  updatePage: UseMutationResult<any, unknown, { pageId: string; data: any; }, unknown>;
}

const GeneralSettingsTab: React.FC<GeneralSettingsTabProps> = ({
  pageData,
  handleInputChangeWithAutoSave,
  handleToggleWithAutoSave,
  getPublicPageUrl,
  updatePage
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const pageUrl = getPublicPageUrl();
  
  const handleSaveGeneralSettings = async () => {
    setIsSaving(true);
    try {
      await updatePage.mutateAsync({
        pageId: updatePage.variables?.pageId,
        data: {
          page_title: pageData.page_title,
          page_slug: pageData.page_slug,
          description: pageData.description,
          is_published: pageData.is_published,
          logo_url: pageData.logo_url
        }
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Configure your business landing page basic information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="page_title">Page Title</Label>
          <Input
            id="page_title"
            name="page_title"
            value={pageData.page_title}
            onChange={handleInputChangeWithAutoSave}
            placeholder="Your Business Name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="page_slug">
            Page URL Slug
            <span className="text-xs text-muted-foreground ml-2">
              (Only lowercase letters, numbers, and hyphens)
            </span>
          </Label>
          <div className="flex items-center gap-2">
            <div className="bg-muted px-3 py-2 rounded-l-md border border-r-0 text-muted-foreground text-sm">
              {window.location.origin}/business/
            </div>
            <Input
              id="page_slug"
              name="page_slug"
              value={pageData.page_slug}
              onChange={handleInputChangeWithAutoSave}
              className="rounded-l-none"
              placeholder="your-business-name"
            />
          </div>
          {pageUrl && (
            <p className="text-xs text-muted-foreground mt-1">
              Public URL: <a href={pageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{pageUrl}</a>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Page Description</Label>
          <Textarea
            id="description"
            name="description"
            value={pageData.description || ''}
            onChange={handleInputChangeWithAutoSave}
            placeholder="Enter a brief description about your business"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo_url">Logo URL</Label>
          <Input
            id="logo_url"
            name="logo_url"
            value={pageData.logo_url || ''}
            onChange={handleInputChangeWithAutoSave}
            placeholder="https://example.com/your-logo.png"
          />
          <p className="text-xs text-muted-foreground">
            Enter a URL to your logo image. Recommended size: 200x200px.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="is_published" className="text-base">Publish Page</Label>
            <p className="text-sm text-muted-foreground">
              Make your business page visible to the public
            </p>
          </div>
          <Switch
            id="is_published"
            checked={pageData.is_published}
            onCheckedChange={(checked) => handleToggleWithAutoSave('is_published', checked)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveGeneralSettings}
          disabled={isSaving || updatePage.isPending}
          className="ml-auto"
        >
          {isSaving || updatePage.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save General Settings
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GeneralSettingsTab;
