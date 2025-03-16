
import React, { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { BusinessPage } from "@/types/business.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

interface PageSettingsTabProps {
  pageData: {
    page_title: string;
    page_slug: string;
    description: string;
    is_published: boolean;
    chatbot_enabled: boolean;
    primary_color: string;
    secondary_color: string;
  };
  handlePageDataChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleToggleChange: (name: string, checked: boolean) => void;
  handleSavePageSettings: () => void;
  updatePage: ReturnType<typeof useMutation<BusinessPage, Error, any>>;
  autoSavePageSettings?: (pageData: Partial<BusinessPage>) => void;
}

const PageSettingsTab: React.FC<PageSettingsTabProps> = ({
  pageData,
  handlePageDataChange,
  handleToggleChange,
  handleSavePageSettings,
  updatePage,
  autoSavePageSettings
}) => {
  const [isDirty, setIsDirty] = React.useState(false);
  
  // Set up debounced auto-save
  const debouncedAutoSave = useDebouncedCallback((data) => {
    if (autoSavePageSettings) {
      autoSavePageSettings(data);
      setIsDirty(false);
    }
  }, 2000);
  
  // Custom input change handler that triggers auto-save
  const handleInputChangeWithAutoSave = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handlePageDataChange(e);
    setIsDirty(true);
    
    if (autoSavePageSettings) {
      const { name, value } = e.target;
      debouncedAutoSave({
        ...pageData,
        [name]: value
      });
    }
  };
  
  // Custom toggle change handler that triggers auto-save
  const handleToggleWithAutoSave = (name: string, checked: boolean) => {
    handleToggleChange(name, checked);
    setIsDirty(true);
    
    if (autoSavePageSettings) {
      debouncedAutoSave({
        ...pageData,
        [name]: checked
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Settings</CardTitle>
        <CardDescription>
          Configure basic settings for your business landing page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="page_title">Page Title</Label>
            <Input
              id="page_title"
              name="page_title"
              value={pageData.page_title}
              onChange={handleInputChangeWithAutoSave}
              placeholder="My Business"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="page_slug">
              Page URL Slug
              <span className="text-xs text-muted-foreground ml-2">
                (e.g. my-business)
              </span>
            </Label>
            <div className="flex items-center">
              <div className="text-sm text-muted-foreground mr-2">
                /business/
              </div>
              <Input
                id="page_slug"
                name="page_slug"
                value={pageData.page_slug}
                onChange={handleInputChangeWithAutoSave}
                placeholder="my-business"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Page Description</Label>
          <Textarea
            id="description"
            name="description"
            value={pageData.description || ""}
            onChange={handleInputChangeWithAutoSave}
            placeholder="Describe your business in a few sentences"
            rows={3}
          />
        </div>
        
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
        
        <div className="flex items-center space-x-2">
          <Switch
            id="is_published"
            checked={pageData.is_published}
            onCheckedChange={(checked) => handleToggleWithAutoSave('is_published', checked)}
          />
          <Label htmlFor="is_published">
            Publish Page
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="chatbot_enabled"
            checked={pageData.chatbot_enabled}
            onCheckedChange={(checked) => handleToggleWithAutoSave('chatbot_enabled', checked)}
          />
          <Label htmlFor="chatbot_enabled">
            Enable AI Chatbot
          </Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isDirty && (
          <p className="text-xs text-muted-foreground">
            Auto-saving changes...
          </p>
        )}
        <Button 
          onClick={handleSavePageSettings} 
          disabled={updatePage.isPending}
          className="ml-auto"
        >
          {updatePage.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PageSettingsTab;
